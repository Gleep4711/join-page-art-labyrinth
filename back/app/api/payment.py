import logging

from app.api.bpay import (bpay_get, decode_base64, process_bpay_callback,
                          process_bpay_check, verify_signature)
from app.db.base import get_db
from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/payment")
async def payment_get():
    return await bpay_get()


@router.post("/payment")
@router.post("/callback")
async def payment(
    data: str = Form(...),
    key: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    # Signature check
    if not verify_signature(data, key):
        logging.error("Signature verification failed")
        # return JSONResponse(status_code=400, content={
        #     "code": -21,
        #     "text": "Incorrect signature"
        # })

    # Decode base64
    payload = decode_base64(data)

    if payload.get("comand") == "check":
        return await process_bpay_check(payload, db)

    return await process_bpay_callback(payload, db)
    # return await bpay_check(data, key)
