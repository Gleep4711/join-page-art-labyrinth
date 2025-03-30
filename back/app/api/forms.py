from typing import List, Optional

import httpx
from app.config import settings
from app.db.base import get_db
from app.db.models import Form
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


class FormDataVolunteers(BaseModel):
    name: str
    age: Optional[int]
    social: Optional[str]
    prof: Optional[str]
    department: Optional[List[str]]


class FormDataMasters(BaseModel):
    name: str
    country: Optional[str] | None
    phone: Optional[str] | None
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


class FormRequest(BaseModel):
    type: str
    data: FormDataVolunteers | FormDataMasters


@router.post('/save')
async def save_form(body: FormRequest, db: AsyncSession = Depends(get_db)):
    if not body.type or not body.data:
        raise HTTPException(status_code=400, detail="type and data are required")

    if body.type == "volunteer":
        await save_volunteer_form(db, body.data)
        await send_to_telegram(body.data.model_dump(), "volunteer")
    elif body.type == "master":
        await save_master_form(db, body.data)
        await send_to_telegram(body.data.model_dump(), "master")
    else:
        raise HTTPException(status_code=400, detail="Invalid form type")

    return {"status": "ok"}


async def save_volunteer_form(db: AsyncSession, data: FormDataVolunteers):
    form = Form(
        form_type="volunteer",
        name=data.name,
        age=data.age,
        social=data.social,
        profession=data.prof,
        department=",".join(data.department) if data.department else None,
        raw_data=data.model_dump_json(),
    )
    db.add(form)
    await db.commit()


async def save_master_form(db: AsyncSession, data: FormDataMasters):
    form = Form(
        form_type="master",
        name=data.name,
        country=data.country,
        phone=data.phone,
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
        raw_data=data.model_dump_json()
    )
    db.add(form)
    await db.commit()

async def send_to_telegram(data: dict, form_type: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    message = f"{form_type}\n\n"
    for key, value in data.items():
        if isinstance(value, list):
            value = "</code>, <code>".join(value)
        if isinstance(value, str) and len(value) > 100:
            value = value[:100] + "..."
        message += f"{key}: <code>{value}</code>\n"

    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
