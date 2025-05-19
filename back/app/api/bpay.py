import base64
from datetime import datetime
import hashlib
import json
import logging
import uuid
from typing import Optional

from pydantic import BaseModel
import requests

from app.api.tickets import generate_ticket_id
from app.config import settings
from app.db.base import get_db
from app.db.models import Order, Ticket
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


def verify_signature(data: str, key: str) -> bool:
    """
    Verifies the signature using two keys: DEV_BPAY_SECRET_KEY and BPAY_SECRET_KEY
    """
    for secret in [settings.DEV_BPAY_SECRET_KEY, settings.BPAY_SECRET_KEY]:
        if not secret:
            continue
        expected_key = hashlib.sha256((data + secret).encode()).hexdigest()
        if key == expected_key:
            return True
    return False


def decode_base64(data: str) -> dict:
    """
    Decodes a base64 string into a dictionary.
    """
    try:
        decoded = base64.b64decode(data)
        payload = json.loads(decoded)
        return payload
    except Exception as e:
        logging.error(f"Base64 decode error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid base64 data")


async def get_order_by_payload(payload: dict, db: AsyncSession) -> Optional[Order]:
    order_id = payload.get("order_id")
    if not order_id:
        return None
    try:
        order_data = await db.execute(select(Order).where(Order.id == int(order_id) - 12344))
        return order_data.scalar_one_or_none()
    except Exception as e:
        logging.error(f"Order lookup error: {str(e)}")
        return None


def order_not_found_response():
    return JSONResponse(status_code=200, content={
        "code": 50,
        "text": "Order not found"
    })


def order_missing_id_response():
    return JSONResponse(status_code=400, content={
        "code": -1,
        "text": "Order ID is missing"
    })


def internal_error_response(e: Exception):
    return JSONResponse(status_code=500, content={
        "code": -500,
        "text": f"Internal error: {str(e)}"
    })


def invalid_command_response():
    return JSONResponse(status_code=400, content={
        "code": -10,
        "text": "Invalid command"
    })


def only_post_allowed_response():
    return {
        "code": -1,
        "text": "This endpoint only accepts POST requests."
    }


async def process_bpay_callback(payload: dict, db: AsyncSession):
    try:
        if not payload.get("order_id"):
            return order_missing_id_response()
        order = await get_order_by_payload(payload, db)
        if not order or str(order.status) == "paid":
            return order_not_found_response()
        if str(order.status) == "new":
            setattr(order, "status", "paid")
            await db.commit()
            return JSONResponse(status_code=200, content={
                "code": 100,
                "text": "success"
            })
        return JSONResponse(status_code=200, content={
            "code": -40,
            "text": "An error occurred while processing your request."
        })
    except Exception as e:
        logging.error(f"Error in process_bpay_callback: {str(e)}")
        return internal_error_response(e)


async def process_bpay_check(payload: dict, db: AsyncSession):
    try:
        if not payload.get("order_id"):
            return order_missing_id_response()
        order = await get_order_by_payload(payload, db)
        if not order or str(order.status) == "paid":
            return order_not_found_response()
        return JSONResponse(status_code=200, content={
            "code": 100,
            "text": "success"
        })
    except Exception as e:
        logging.error(f"Error in process_bpay_check: {str(e)}")
        return internal_error_response(e)


@router.get("/pay")
@router.get("/check")
@router.get("/callback")
async def bpay_get():
    return only_post_allowed_response()


@router.post("/pay")
@router.post("/check")
@router.post("/callback")
async def bpay_check(
    data: str = Form(...),
    key: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    # Signature verification
    if not verify_signature(data, key):
        logging.error("Signature verification failed")
        # return JSONResponse(status_code=400, content={
        #     "code": -21,
        #     "text": "Incorrect signature"
        # })
    # Base64 decoding
    payload = decode_base64(data)
    command = payload.get("comand", None)
    if not command:
        command = payload.get("command", None)
    if command == "pay":
        return await process_bpay_callback(payload, db)
    if command == "check":
        return await process_bpay_check(payload, db)
    return invalid_command_response()

# Example request structure:
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


class Orderdata(BaseModel):
    type_order: str
    quantity: int
    name: str
    phone: str
    email: str
    lang: str


async def add_ticket(data: Orderdata, db: AsyncSession) -> int | None:
    for i in range(5):
        ticket_id = generate_ticket_id("G", 9)
        ticket = Ticket(
            ticket_id=ticket_id,
            name=data.name,
            phone=data.phone,
            email=data.email,
            comment="online",
        )
        db.add(ticket)
        await db.commit()
        await db.refresh(ticket)
        return int(str(ticket.id))
    raise HTTPException(status_code=500, detail="Failed to generate ticket")


@router.post("/create_order")
async def create_order(
    data: Orderdata,
    db: AsyncSession = Depends(get_db),
):
    tickets_ids = []
    if data.quantity > 10:
        data.quantity = 10
    for i in range(data.quantity):
        id = await add_ticket(data, db)
        tickets_ids.append(id)

    amount = 500
    if data.type_order == "preferential":
        amount = 250
    if data.type_order == "family":
        amount = 375

    order = Order(
        uuid=str(uuid.uuid4()),
        tickets_ids=",".join(map(str, tickets_ids)),
        amount=data.quantity * amount,
        status="new",
        customer=data.name,
        phone=data.phone,
        email=data.email,
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    success_url = 'https://fest.art-labyrinth.org/success'
    fail_url = 'https://fest.art-labyrinth.org/fail'
    callback_url = 'https://admin.art-labyrinth.org/api/v1/bpay/callback'
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    payload = {
        'uuid': order.uuid,
        'merchantid': settings.DEV_BPAY_MERCHANT_ID,
        'dtime': current_time,
        'description': 'Art-Labyrinth Summer Festival 2025',
        'amount': data.quantity * amount,
        'order_id': order.id + 12344,

        'currency': 498,
        'success_url': success_url,
        'fail_url': fail_url,
        'callback_url': callback_url,
        'lang': data.lang,
        'params': {
            "order_id": order.id + 12344,
        }
    }

    json_data = json.dumps(payload, separators=(',', ':'))
    base64_data = base64.b64encode(json_data.encode('utf-8')).decode('utf-8')

    signature_string = base64_data + settings.DEV_BPAY_SECRET_KEY
    signature = hashlib.sha256(signature_string.encode('utf-8')).hexdigest()

    form_data = {
        'data': base64_data,
        'key': signature
    }

    try:
        headers = {'User-Agent': 'curl/7.68.0'}
        response = requests.post(
            settings.DEV_BPAY_SERVER_URL + 'merchant',
            json=form_data,
            headers=headers,
            allow_redirects=False,
        )
        # Check the redirect
        if response.is_redirect or response.status_code in (301, 302, 303, 307, 308):
            redirect_url = response.headers.get('Location')
            if redirect_url:
                return {
                    "redirect_url": redirect_url,
                    "order_id": order.id + 12344,
                }
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create order")
