import base64
import hashlib
import json
import logging

from sqlalchemy import select

from app.config import settings
from app.db.base import get_db
from app.db.models import Order
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


def verify_signature(data: str, key: str) -> bool:
    """
    Checks the signature on two keys: DEV_BPAY_SECRET_KEY and BPAY_SECRET_KEY
    """
    for secret in [settings.DEV_BPAY_SECRET_KEY, settings.BPAY_SECRET_KEY]:
        if secret == "":
            continue
        expected_key = hashlib.sha256((data + secret).encode()).hexdigest()
        if key == expected_key:
            return True
    return False

def decode_base64(data: str) -> dict:
    """
    Decode base64 encoded data and returns the payload as a dictionary.
    """
    try:
        decoded = base64.b64decode(data)
        payload = json.loads(decoded)
        return payload
    except Exception as e:
        logging.error(f"Failed to decode base64 data: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid base64 data")


async def process_bpay_callback(payload: dict, db: AsyncSession):
    try:
        order_id = payload.get("order_id")
        if not order_id:
            return JSONResponse(status_code=400, content={
                "code": "-1",
                "text": "Order ID is missing"
            })

        order_data = await db.execute(select(Order).where(Order.id == int(order_id) - 12344))
        order = order_data.scalar_one_or_none()

        if not order or str(order.status) == "paid":
            return JSONResponse(status_code=200, content={
                "code": "50",
                "text": "Order not found"
            })

        if str(order.status) == "new":
            setattr(order, "status", "paid")
            await db.commit()
            return JSONResponse(status_code=200, content={
                "code": "100",
                "text": "success"
            })

        return JSONResponse(status_code=200, content={
            "code": "-40",
            "text": "An error occurred while processing your request."
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "code": "-500",
            "text": f"Internal error: {str(e)}"
        })


async def process_bpay_check(payload: dict, db: AsyncSession):
    try:
        order_id = payload.get("order_id")
        if not order_id:
            return JSONResponse(status_code=400, content={
                "code": "-1",
                "text": "Order ID is missing"
            })

        order_data = await db.execute(select(Order).where(Order.id == int(order_id) - 12344))
        order = order_data.scalar_one_or_none()

        if not order or str(order.status) == "paid":
            return JSONResponse(status_code=200, content={
                "code": "50",
                "text": "Order not found"
            })

        return JSONResponse(status_code=200, content={
            "code": "100",
            "text": "success"
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "code": "-500",
            "text": f"Internal error: {str(e)}"
        })


@router.get("/pay")
@router.get("/check")
@router.get("/callback")
async def bpay_get():
    return {
        "code": "-1",
        "text": "This endpoint only accepts POST requests."
    }


@router.post("/pay")
@router.post("/check")
@router.post("/callback")
async def bpay_check(
    data: str = Form(...),
    key: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    # Signature check
    if not verify_signature(data, key):
        logging.error("Signature verification failed")
        # return JSONResponse(status_code=400, content={
        #     "code": "-21",
        #     "text": "Incorrect signature"
        # })

    # Decode base64
    payload = decode_base64(data)
    if payload.get("comand") == "pay":
        return await process_bpay_callback(payload, db)

    if payload.get("comand") == "check":
        return await process_bpay_check(payload, db)

    return JSONResponse(status_code=400, content={
        "code": "-10",
        "text": "Invalid command"
    })



# {
#     "merchantid": "test_merchant",
#     "comand": "check",
#     "order_id": "123456789",
#     "amount": 10000,
#     "valute": 498,
#     "params": {
#         "customer_name": "John Doe",
#         "phone_number": "069123456",
#         "email": "john.doe@example.com"
#     }
# }
