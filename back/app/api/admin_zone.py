import os

from app.db.base import get_db
from app.db.models import Form, Ticket
from app.jwt import JWTPayload, verify_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


def form_to_dict(form, with_files=False):
    form_dict = {key: value for key, value in vars(form).items() if not key.startswith('_')}
    if with_files:
        form_dict["files"] = []
        media_dir = f"/srv/data/media/art-lab/fest2025/form/{form_dict.get('id')}"
        if os.path.exists(media_dir):
            files = os.listdir(media_dir)
            for file in files:
                form_dict["files"].append(f"https://files.art-labyrinth.org/fest2025/form/{form_dict.get('id')}/{file}")
    return form_dict


async def get_forms_by_type(db: AsyncSession, form_type: str):
    query = select(Form).where(Form.form_type == form_type, Form.deleted_at.is_(None))
    result = await db.execute(query.order_by(Form.created_at.desc()))
    return result.scalars().all()


@router.get('/masters/list')
async def get_masters(
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token)
):
    if current_user.get("name") != "MuzArt" and current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    data = await get_forms_by_type(db, "master")
    return [form_to_dict(form, with_files=True) for form in data]


@router.get('/volunteers/list')
async def get_volunteers(
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token)
):
    if current_user.get("name") != "VolnaFest" and current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    data = await get_forms_by_type(db, "volunteer")
    return [form_to_dict(form) for form in data]
