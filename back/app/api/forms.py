import asyncio
import json
import logging
import os
import random
import re
import uuid
from io import BytesIO
from typing import List, Optional

import httpx
from app.config import settings
from app.csrf import generate_csrf_token, validate_csrf_token
from app.db.base import get_db
from app.db.models import Form
from fastapi import APIRouter, Depends, File
from fastapi import Form as FastAPIForm
from fastapi import HTTPException, Request, UploadFile
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


class FormDataVolunteers(BaseModel):
    name: str
    age: Optional[int]
    social: Optional[str]
    tg: Optional[str]
    prof: Optional[str]
    department: Optional[List[str]]


class FormDataMasters(BaseModel):
    id: Optional[int] = None
    name: str
    country: Optional[str] | None
    tg: Optional[str] | None
    email: Optional[str] | None
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
    file: Optional[List[UploadFile]] = None


async def save_form_data(
    db: AsyncSession,
    form_type: str,
    data: FormDataVolunteers | FormDataMasters,
    files: Optional[List[UploadFile]] = None
):
    if form_type == "volunteer":
        form = Form(
            form_type="volunteer",
            name=data.name,
            age=data.age,
            social=data.social,
            phone=data.tg,
            profession=data.prof,
            department=",".join(data.department) if data.department else None,
            raw_data=data.model_dump_json(),
        )
    elif form_type == "master":
        form = Form(
            form_type="master",
            name=data.name,
            country=data.country,
            phone=data.tg,
            email=data.email,
            program_direction=",".join(data.direction) if data.direction else None,
            program_description=data.description,
            program_example=data.programUrl,
            event_dates=",".join(data.date) if data.date else None,
            quantity=data.quantity,
            time=data.time,
            duration=data.duration,
            lang=",".join(data.lang) if data.lang else None,
            raider=data.raider,
            raw_data=data.model_dump_json(),
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid form type")

    db.add(form)
    await db.commit()
    await db.refresh(form)

    if form_type == "master" and files:
        await save_files_to_disk_and_telegram(form.id, files)

    return form


async def save_files_to_disk_and_telegram(form_id: int, files: List[UploadFile]):
    media_dir = f"/srv/data/media/art-lab/fest2025/form/{form_id}"
    os.makedirs(media_dir, exist_ok=True)

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendDocument"

    for file in files:
        sanitized_filename = re.sub(r'[^\w\-.]', '', file.filename)
        name, ext = os.path.splitext(sanitized_filename)
        sanitized_filename = f"{random.randint(100, 999)}_{name[:20]}{ext}"

        file_content = await file.read()
        file_path = os.path.join(media_dir, sanitized_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        file_buffer = BytesIO(file_content)
        file_buffer.seek(0)

        payload = {
            "chat_id": settings.TELEGRAM_CHAT_ID,
            "disable_notification": True,
        }
        telegram_file = {
            "document": (sanitized_filename, file_buffer, file.content_type),
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=payload, files=telegram_file)
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Failed to send file: {response.text}")

        file_buffer.close()
        await asyncio.sleep(1)


@router.post('/save')
async def save_form(
    request: Request,
    form_type: str = FastAPIForm(...),
    data: str = FastAPIForm(...),
    csrf_token: str = FastAPIForm(...),
    file: Optional[List[UploadFile]] = File(None),
    db: AsyncSession = Depends(get_db)
):
    session_id = request.headers.get("X-Session-ID")

    if not session_id:
        return {"status": "ok", "form_id": random.randint(100, 999)}

    validate_csrf_token(csrf_token, session_id + request.client.host)

    if form_type == "master":
        parsed_data = FormDataMasters(**json.loads(data))
        parsed_data.file = ', '.join([file.filename for file in file]) if file else None
    elif form_type == "volunteer":
        parsed_data = FormDataVolunteers(**json.loads(data))
    else:
        raise HTTPException(status_code=400, detail="Invalid form type")

    form = await save_form_data(db, form_type, parsed_data, file)
    if form_type == "master":
        parsed_data.id = form.id
    await send_to_telegram(parsed_data.model_dump(), form_type)

    return {"status": "ok"}


async def send_to_telegram(data: dict, form_type: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    message = f"{form_type}\n\n"
    for key, value in data.items():
        if isinstance(value, list):
            value = "</code>, <code>".join(value)
        if isinstance(value, str) and len(value) > 200:
            value = value[:200] + "..."
        message += f"{key}: <code>{value}</code>\n"

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
    logging.debug(f"Session ID: {session_id}")
    logging.debug(request.client.host)
    if not session_id:
        csrf_token = generate_csrf_token(uuid.uuid4().hex + str(random.randint(100000, 999999)) * 2)
    else:
        csrf_token = generate_csrf_token(session_id + request.client.host)

    return {"csrf_token": csrf_token}