import logging
from typing import List, Optional

from app.db.base import get_db
from app.db.models import Form
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

class FormDataMasters(BaseModel):
    name: str
    age: Optional[int]
    phone: Optional[str]
    prof: Optional[str]
    department: Optional[List[str]]
    programDirection: Optional[str]
    programDescription: Optional[str]
    eventDates: Optional[str]

class FormDataVolunteers(BaseModel):
    name: str = Field(..., max_length=100)
    age: Optional[int] = Field(None, ge=0, le=120)
    phone: Optional[str] = Field(None, regex=r'^\+?[0-9]{10,15}$')
    prof: Optional[str] = Field(None, max_length=144)
    department: Optional[List[str]]

class FormRequest(BaseModel):
    type: str
    data: FormDataVolunteers | FormDataMasters

@router.post('/save')
async def save_form(body: FormRequest, db: AsyncSession = Depends(get_db)):
    logging.debug(f"type: {body.type}, data: {body.data}")

    if not body.type or not body.data:
        raise HTTPException(status_code=400, detail="type and data are required")

    data_dict = {key: value for key, value in body.data.model_dump().items() if value is not None}

    form = Form(
        form_type=body.type,
        name=data_dict.get("name", None),
        age=data_dict.get("age", None),
        phone=data_dict.get("phone", None),
        profession=data_dict.get("prof", None),
        department=",".join(data_dict["department"]) if "department" in data_dict else None,
        program_direction=data_dict.get("programDirection", None),
        program_description=data_dict.get("programDescription", None),
        event_dates=data_dict.get("eventDates", None),
        raw_data=body.model_dump_json()
    )

    db.add(form)
    await db.commit()

    return {"status": "ok"}