import asyncio
import random
from io import BytesIO

import httpx
import qrcode
from sqlalchemy import select
from app.config import settings
from app.db.models import Ticket
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from fastapi import Depends
from fastapi.responses import JSONResponse

from back.app.jwt import JWTPayload, verify_token
router = APIRouter()


def generate_ticket_id(prefix: str, part: int) -> str:
    """ Generate a unique ticket ID based on the prefix and random numbers.
    The ticket ID format is as follows:
    prefix-XXX-XXXX, where XXX is a random 3-digit number and XXXX is a random 4-digit number.


    Args:
        prefix (str):
            G - Guest Гость\n
            M - Master Мастер\n
            V - Volonteer Волонтер\n
            O - Orgs Организатор\n
            P - Parasite Бесплатник\n
            F - Friends Друзья\n
            C - Cash Наличка

    Returns:
        str: Generated ticket ID in the format prefix-XXX-XXXX.
    """
    return "{}-{}{}-{}".format(
        prefix,
        part,
        "".join(map(str, random.sample(range(10), 2))),
        "".join(map(str, random.sample(range(10), 4)))
    )

class TicketRequest(BaseModel):
    """ Request model for generating a ticket. """
    prefix: str = Field(
        ...,
        description="Prefix for the ticket ID. "
                    "G - Guest Гость\n"
                    "M - Master Мастер\n"
                    "V - Volonteer Волонтер\n"
                    "O - Orgs Организатор\n"
                    "P - Parasite Бесплатник\n"
                    "F - Friends Друзья\n"
                    "C - Cash Наличка"
    ),
    name: str = Field(
        ...,
        description="Name of the person receiving the ticket."
    ),
    email: str = Field(
        ...,
        description="Email address of the person receiving the ticket."
    ),

@router.post('/generate_ticket')
async def generate_ticket(request: TicketRequest) -> StreamingResponse:
    """ Generate a ticket with a QR code and return the ticket ID.

    Args:
        prefix (str): The prefix for the ticket ID.

    Returns:
        dict: A dictionary containing the ticket ID and the QR code image.
    """
    ticket_id = generate_ticket_id(request.prefix)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(ticket_id)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    img_stream = BytesIO()
    img.save(img_stream, format="PNG")
    img_stream.seek(0)

    asyncio.create_task(send_to_telegram(img_stream))

    return StreamingResponse(img_stream, media_type="image/png")

async def send_to_telegram(img_stream):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendPhoto"
    payload = {"chat_id": settings.TELEGRAM_CHAT_ID}
    files = {"photo": ("ticket.png", img_stream, "image/png")}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload, files=files)
        if response.status_code != 200:
            print(f"Failed to send image to Telegram: {response.text}")

@router.get('get_tickets')
async def get_tickets(
    offset: int = 0,
    limit: int = 100,
    prefix: str = "",
    part: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token),
):
    """ Get a list of tickets with pagination.

    Args:
        offset (int): The offset for pagination.
        limit (int): The limit for pagination.

    Returns:
        list: A list of tickets.
    """
    if current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        if part > 0 and part < 10:
            if prefix:
                like_pattern = f"{prefix}-{part}%"
            else:
                like_pattern = f"_-{part}%"
        else:
            like_pattern = f"{prefix}%" if prefix else "%"
        query = await db.execute(
            select(Ticket).where(Ticket.ticket_id.like(like_pattern)).offset(offset).limit(limit)
        )

        tickets: Ticket = query.scalars().all()
        return tickets
    except Exception as e:
        return {"status": "fail", "error": str(e)}

