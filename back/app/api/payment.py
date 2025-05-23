from app.api import bpay
from app.db.base import get_db
from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/payment")
@router.post("/callback")
async def payment(
    data: str = Form(...),
    key: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    payload = bpay.decode_base64(data)
    if payload.get("comand") == "check":
        return await bpay.process_bpay_check(payload, db)

    return await bpay.process_bpay_callback(payload, db)
