import asyncio
import json
import logging
import os
import random
import re
import uuid
from datetime import datetime, timezone
from io import BytesIO
from typing import List, Optional, cast

import httpx
from app.config import settings
from app.csrf import generate_csrf_token, validate_csrf_token
from app.db.base import get_db
from app.db.models import Form
from app.jwt import JWTPayload, verify_token
from fastapi import APIRouter, Depends, File
from fastapi import Form as FastAPIForm
from fastapi import HTTPException, Request, UploadFile
from fastapi.background import BackgroundTasks
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


class FormDataVolunteers(BaseModel):
    name: str
    age: Optional[int]
    social: Optional[str]
    tg: Optional[str]
    prof: Optional[str]
    conditions: Optional[str] = None
    experience: Optional[str] = None
    camping: Optional[str] = None
    department: Optional[List[str]]
    negative: Optional[str] = None
    help_now: Optional[bool] = False
    inspiration: Optional[str] = None


class FormDataMasters(BaseModel):
    id: Optional[int] = None
    name: str
    country: Optional[str] | None
    tg: Optional[str] | None
    email: Optional[str] | None
    previously_participated: Optional[bool] | None
    direction: Optional[List[str]]
    description: Optional[str] | None
    date: Optional[List[str]] | None
    programUrl: Optional[str] | None
    socialUrl: Optional[str] | None
    quantity: Optional[str] | None
    time: Optional[str] | None
    duration: Optional[str] | None
    lang: Optional[List[str]] | None
    raider: Optional[str] | None
    additional_info: Optional[str] | None
    file: Optional[List[UploadFile]] = None


async def save_form_data(
    db: AsyncSession,
    form_type: str,
    data: FormDataVolunteers | FormDataMasters,
):
    if form_type == "volunteer":
        volunteer_data = cast(FormDataVolunteers, data)
        form = Form(
            form_type="volunteer",
            name=volunteer_data.name,
            age=volunteer_data.age,
            social=volunteer_data.social,
            phone=volunteer_data.tg,
            profession=volunteer_data.prof,
            conditions=volunteer_data.conditions,
            experience=volunteer_data.experience,
            camping=volunteer_data.camping,
            department=",".join(volunteer_data.department) if volunteer_data.department else None,
            negative=volunteer_data.negative,
            help_now=volunteer_data.help_now,
            inspiration=volunteer_data.inspiration,

            # raw_data=volunteer_data.model_dump_json(),
        )
    elif form_type == "master":
        master_data = cast(FormDataMasters, data)
        form = Form(
            form_type="master",
            name=master_data.name,
            country=master_data.country,
            phone=master_data.tg,
            email=master_data.email,
            previously_participated=str(master_data.previously_participated) if master_data.previously_participated else None,
            program_direction=",".join(master_data.direction) if master_data.direction else None,
            program_description=master_data.description,
            event_dates=",".join(master_data.date) if master_data.date else None,
            program_example=master_data.programUrl,
            social=master_data.socialUrl,
            quantity=master_data.quantity,
            time=master_data.time,
            duration=master_data.duration,
            lang=",".join(master_data.lang) if master_data.lang else None,
            raider=master_data.raider,
            additional_info=master_data.additional_info,
            # raw_data=master_data.model_dump_json(),
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid form type")

    db.add(form)
    await db.commit()
    await db.refresh(form)

    return form


async def save_files_to_disk_and_telegram(form_id: int, files: List[tuple]):
    media_dir = f"/srv/data/media/art-lab/fest2025/form/{form_id}"
    os.makedirs(media_dir, exist_ok=True)

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN.get_secret_value()}/sendDocument"

    for filename, file_content, content_type in files:
        sanitized_filename = re.sub(r'[^\w\-.]', '', filename)
        name, ext = os.path.splitext(sanitized_filename)
        sanitized_filename = f"{random.randint(100, 999)}_{name[:20]}{ext}"

        file_path = os.path.join(media_dir, sanitized_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        if len(file_content) > 49 * 1024 * 1024:
            continue

        file_buffer = BytesIO(file_content)
        file_buffer.seek(0)

        payload = {
            "chat_id": settings.TELEGRAM_CHAT_ID,
            "disable_notification": True,
        }
        telegram_file = {
            "document": (sanitized_filename, file_buffer, content_type),
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=payload, files=telegram_file)
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Failed to send file: {response.text}")

        file_buffer.close()
        await asyncio.sleep(2)


@router.post('/save')
async def save_form(
    request: Request,
    background_tasks: BackgroundTasks,
    form_type: str = FastAPIForm(...),
    data: str = FastAPIForm(...),
    csrf_token: str = FastAPIForm(...),
    file: Optional[List[UploadFile]] = File(None),
    db: AsyncSession = Depends(get_db),
):
    session_id = request.headers.get("X-Session-ID")

    if not session_id:
        return {"status": "ok", "form_id": random.randint(100, 999)}

    validate_csrf_token(csrf_token, session_id + request.client.host if request.client else "")

    if form_type == "master":
        parsed_data = FormDataMasters(**json.loads(data))
        # parsed_data.file = [file.filename for file in file] if file else []
        parsed_data.file = file
    elif form_type == "volunteer":
        parsed_data = FormDataVolunteers(**json.loads(data))
    else:
        raise HTTPException(status_code=400, detail="Invalid form type")

    form = await save_form_data(db, form_type, parsed_data)
    if form_type == "master":
        # parsed_data.id = form.id
        setattr(parsed_data, "id", form.id)
        if file:
            file_contents = [(f.filename, await f.read(), f.content_type) for f in file]
            background_tasks.add_task(save_files_to_disk_and_telegram, int(str(form.id)), file_contents)

    background_tasks.add_task(send_to_telegram, parsed_data.model_dump(), form_type)

    return {"status": "ok"}


async def send_to_telegram(data: dict, form_type: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN.get_secret_value()}/sendMessage"
    message = f"{form_type}\n\n"
    for key, value in data.items():
        text = ""
        if isinstance(value, list):
            for item in value:
                item: UploadFile | str
                if isinstance(item, str):
                    text += f"<code>{item}</code>\n"
                elif isinstance(item.filename, str):
                    text += f"<code>{item.filename}</code>\n"
        else:
            text = f"<code>{str(value)[:400]}</code>"

        message += f"{key}: {text}\n"

    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
    }

    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)


@router.get('/csrf-token')
async def get_csrf_token(request: Request):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        csrf_token = generate_csrf_token(uuid.uuid4().hex + str(random.randint(100000, 999999)) * 2)
    else:
        csrf_token = generate_csrf_token(session_id + request.client.host if request.client else "")

    return {"csrf_token": csrf_token}


@router.get('/get_forms')
async def get_forms(
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token)
):
    query = select(Form)
    if current_user.get("name") == "VolnaFest":
        query = query.where(Form.form_type == "volunteer", Form.deleted_at.is_(None))
    elif current_user.get("name") == "MuzArt":
        query = query.where(Form.form_type == "master", Form.deleted_at.is_(None))
    elif current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    query = await db.execute(query.order_by(Form.created_at.desc()))

    data = query.scalars().all()
    return_data = []
    for form in data:
        form_dict: dict = {key: value for key, value in vars(
            form).items() if not key.startswith('_') and key != "raw_data"}
        form_dict["files"] = []

        media_dir = f"/srv/data/media/art-lab/fest2025/form/{form_dict.get("id")}"

        if os.path.exists(media_dir):
            files = os.listdir(media_dir)
            for file in files:
                form_dict["files"].append(f"https://files.art-labyrinth.org/fest2025/form/{form_dict.get("id")}/{file}")

        return_data.append(form_dict)
    return return_data


@router.delete('/delete/{form_id}')
async def delete_form(
    form_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token)
):
    query = await db.execute(select(Form).where(Form.id == form_id))
    form = query.scalars().first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if current_user.get("role") != 1:
        if str(form.form_type) == "master":
            if current_user.get("name") != "MuzArt":
                raise HTTPException(status_code=403, detail="Access denied")
        elif str(form.form_type) == "volunteer":
            if current_user.get("name") != "VolnaFest":
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            raise HTTPException(status_code=403, detail="Access denied")

    # form.deleted_at = datetime.now(timezone.utc)
    setattr(form, "deleted_at", datetime.now(timezone.utc))
    await db.commit()
    await db.refresh(form)

    # media_dir = f"/srv/data/media/art-lab/fest2025/form/{form_id}"
    # if os.path.exists(media_dir):
    #     os.rmdir(media_dir)

    return {"status": "ok"}
