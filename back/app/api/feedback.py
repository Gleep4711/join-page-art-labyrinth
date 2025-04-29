import logging
from typing import Optional

from app.csrf import validate_csrf_token
from app.db.base import get_db
from app.db.models import Feedback
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

class FeedbackForm(BaseModel):
    dest: Optional[str] = "Unknown"
    name: Optional[str] = Field(default=None)
    last: Optional[str]
    phone: Optional[str]
    email: str
    message: str
    csrf_token: str

@router.post("/submit")
async def save_form_data(
    request: Request,
    feedback: FeedbackForm,
    db: AsyncSession = Depends(get_db)
):
    if feedback.name != "":
        logging.error("Name is not empty")
        return {"status": "ok"}

    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        logging.error("Session ID is missing")
        return {"status": "ok"}
    validate_csrf_token(feedback.csrf_token, session_id + request.client.host)

    try:
        form = Feedback(
            name=feedback.last,
            phone=feedback.phone,
            email=feedback.email,
            message=feedback.message,
            dest=feedback.dest
        )
        db.add(form)
        await db.commit()
        return {"status": "ok"}
    except Exception as e:
        await db.rollback()
        logging.error(f"Error saving feedback form: {e}")
        return {"status": "fail"}
