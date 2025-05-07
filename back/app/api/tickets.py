import asyncio
import random
from io import BytesIO

import httpx
import qrcode
from app.config import settings
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

router = APIRouter()


def generate_ticket_id(prefix: str) -> str:
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
    return "{}-{}-{}".format(
        prefix,
        "".join(map(str, random.sample(range(10), 3))),
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
async def generate_ticket(request: TicketRequest):
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
