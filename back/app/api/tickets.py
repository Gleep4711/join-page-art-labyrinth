import asyncio
import random
from io import BytesIO

import httpx
import qrcode
from app.config import settings
from app.db.base import get_db
from app.db.models import Ticket
from app.jwt import JWTPayload, verify_token
from app.tickets.generator import (FONT_PATH, FONT_PATH_BOLD, SOURCE_FILE, generate_m_ticket_buffers,
                                   generate_ticket_buffers)
from app.tickets.smtp import smtp_client
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


def generate_ticket_id(prefix: str, part: int = 0) -> str:
    """ Generate a unique ticket ID based on the prefix and random numbers.
    The ticket ID format is as follows:
    prefix-XXX-XXXX, where XXX is a random 3-digit number and XXXX is a random 4-digit number.


    # Args:
    #     prefix (str):
    #         G - Guest Гость\n
    #         M - Master Мастер\n
    #         V - Volonteer Волонтер\n
    #         O - Orgs Организатор\n
    #         P - Parasite Бесплатник\n
    #         F - Friends Друзья\n
    #         C - Cash Наличка

    Returns:
        str: Generated ticket ID in the format prefix-XXX-XXXX.
    """
    if part == 0:
        return "G-086-3729"
    return "{}-{}{}-{}".format(
        prefix,
        part,
        "".join(map(str, random.sample(range(10), 2))),
        "".join(map(str, random.sample(range(10), 4)))
    )


class TicketRequest(BaseModel):
    """ Request model for generating a ticket. """
    prefix: str = "G"
    name: str = ""
    email: str = ""
    part: int = 0


@router.post('/generate_ticket')
async def generate_ticket(
    request: TicketRequest,
    current_user: JWTPayload = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """ Generate a ticket with a QR code and return the ticket ID.

    Args:
        prefix (str): The prefix for the ticket ID.

    Returns:
        dict: A dictionary containing the ticket ID and the QR code image.
    """
    ticket_id = generate_ticket_id(request.prefix, request.part)
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
    img.save(img_stream, format="PNG") # type: ignore
    img_stream.seek(0)

    asyncio.create_task(send_to_telegram(img_stream))

    return StreamingResponse(img_stream, media_type="image/png")


async def send_to_telegram(img_stream):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN.get_secret_value()}/sendPhoto"
    payload = {"chat_id": settings.TELEGRAM_CHAT_ID}
    files = {"photo": ("ticket.png", img_stream, "image/png")}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload, files=files)
        if response.status_code != 200:
            print(f"Failed to send image to Telegram: {response.text}")


@router.get('/get')
@router.get('/list')
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

        return query.scalars().all()
    except Exception as e:
        return {"status": "fail", "error": str(e)}


class AddTicketRequest(BaseModel):
    code: str
    comment: str = ""


@router.post('/add')
async def add_ticket(
    request: AddTicketRequest,
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token),
):
    """ Add a new ticket to the database.

    Args:
        request (AddTicketRequest): The request model containing the ticket code.

    Returns:
        dict: A dictionary containing the status of the operation.
    """
    if current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        ticket = Ticket(
            ticket_id=request.code,
            comment=request.comment,
        )
        db.add(ticket)
        await db.commit()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "fail", "error": str(e)}


@router.post('/test_send_ticket')
async def test_send_ticket(
    request: TicketRequest,
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token),
):
    if current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate ticket image and PDF in memory
    ticket_id = generate_ticket_id(request.prefix, request.part)
    client_name = request.name or "Test User"
    ticket_type = {
        'G': 'Guest', 'M': 'Master', 'V': 'Volunteer', 'O': 'Organizer',
        'P': 'Parasite', 'F': 'Friends', 'C': 'Cash', 'S': 'Family', 'L': 'Discounted'
    }.get(request.prefix, 'Guest')

    _, pdf_buffer = generate_ticket_buffers(
        ticket_id=ticket_id,
        client_name=client_name,
        ticket_type=ticket_type,
    )

    png_buffer, _ = generate_m_ticket_buffers(
        ticket_id=ticket_id,
        client_name=client_name,
        ticket_type=ticket_type,
    )

    # Prepare attachments for smtp_client
    attachments = [
        {'buffer': png_buffer, 'filename': 'ticket.png'},
        {'buffer': pdf_buffer, 'filename': 'ticket.pdf'}
    ]

    # Send email
    try:
        smtp_client.send_mail(
            to_email=request.email,
            template='with_attachments',
            context={'name': client_name},
            attachments=attachments
        )
        return {"status": "ok", "ticket_id": ticket_id}
    except Exception as e:
        return {"status": "fail", "error": str(e)}
