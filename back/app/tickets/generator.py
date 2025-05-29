#!./.venv/bin/python
# -*- coding: utf-8 -*-

import io
import os

import qrcode
from PIL import Image, ImageDraw, ImageFont
from PIL.Image import Image as PILImage
from qrcode.image.pil import PilImage

# --- Constants ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_PATH = os.path.join(BASE_DIR, "PlayfairDisplay-SemiBold.ttf")
FONT_PATH_BOLD = os.path.join(BASE_DIR, "PlayfairDisplay-Bold.ttf")
SOURCE_FILE = os.path.join(BASE_DIR, "A4.png")
M_SOURCE_FILE = os.path.join(BASE_DIR, "M1.png")
M2_SOURCE_FILE = os.path.join(BASE_DIR, "M2.png")
TICKETS_DIR = os.path.join(BASE_DIR, "source")

TICKETS = [
    {"ticket_id": "G-086-3730", "client_name": "Elena Petrova", "ticket_type": "Guest"},
    {"ticket_id": "M-086-3731", "client_name": "Longlonglongname Longlastname", "ticket_type": "Master"},
    {"ticket_id": "V-086-3732", "client_name": "Maria Ivanova", "ticket_type": "Volunteer"},
    {"ticket_id": "O-086-3733", "client_name": "Sergey Vasiliev", "ticket_type": "Organizer"},
    {"ticket_id": "S-086-3734", "client_name": "Anna Kuzmina", "ticket_type": "Family"},
    {"ticket_id": "F-086-3735", "client_name": "Dmitry Sokolov", "ticket_type": "Friends"},
    {"ticket_id": "C-086-3736", "client_name": "Olga Fedorova", "ticket_type": "Cash"},
    {"ticket_id": "L-086-3737", "client_name": "Ivan Petrov", "ticket_type": "Discounted"},
]

def save_ticket_images(background: PILImage, ticket_id, as_pdf=True):
    """Saves the ticket image as PNG and PDF (if as_pdf=True) to disk (legacy)."""
    if not os.path.exists(TICKETS_DIR):
        os.makedirs(TICKETS_DIR)
    if as_pdf:
        pdf_path = os.path.join(TICKETS_DIR, f"{ticket_id}.pdf")
        background_rgb = background.convert("RGB")
        background_rgb.save(pdf_path, "PDF")
    else:
        png_path = os.path.join(TICKETS_DIR, f"{ticket_id}.png")
        background.save(png_path)



def generate_ticket(ticket_id, client_name, ticket_type):
    """Legacy: generates and saves ticket to disk."""
    qr_block = create_qr_code(ticket_id, FONT_PATH_BOLD)
    text_block = create_client_info(client_name, ticket_type, FONT_PATH)
    background = Image.open(SOURCE_FILE).convert("RGBA")
    background.alpha_composite(qr_block, (133, 429))
    background.alpha_composite(text_block, (485, 550))
    save_ticket_images(background, ticket_id)


def generate_m_ticket(ticket_id, client_name, ticket_type):
    """Legacy: generates and saves M-ticket to disk."""
    qr_block = create_qr_code(ticket_id, FONT_PATH_BOLD, box_size=8)
    text_block = create_client_info(client_name, ticket_type, FONT_PATH, size=(24, 20))
    background = Image.open(M_SOURCE_FILE).convert("RGBA")
    background.alpha_composite(qr_block, (78, 250))
    background.alpha_composite(text_block, (75, 620))
    if not os.path.exists(TICKETS_DIR):
        os.makedirs(TICKETS_DIR)
    png_path = os.path.join(TICKETS_DIR, f"{ticket_id}.png")
    background.save(png_path)


def generate_ticket_buffers(ticket_id, client_name, ticket_type):
    """
    Generates a ticket and returns PNG and PDF buffers (or only PNG if as_pdf=False).
    Returns: (png_buffer, pdf_buffer)
    """
    qr_block = create_qr_code(ticket_id, FONT_PATH_BOLD)
    text_block = create_client_info(client_name, ticket_type, FONT_PATH)
    background = Image.open(SOURCE_FILE).convert("RGBA")
    background.alpha_composite(qr_block, (133, 429))
    background.alpha_composite(text_block, (485, 550))

    pdf_buffer = io.BytesIO()
    background_rgb = background.convert("RGB")
    background_rgb.save(pdf_buffer, format="PDF")
    pdf_buffer.seek(0)

    return pdf_buffer


def generate_m_ticket_buffers(ticket_id, client_name, ticket_type):
    """
    Generates an M-ticket and returns PNG and PDF buffers (or only PNG if as_pdf=False).
    Returns: (png_buffer, pdf_buffer)
    """
    qr_block = create_qr_code(ticket_id, FONT_PATH_BOLD, box_size=8)
    text_block = create_client_info(client_name, ticket_type, FONT_PATH, size=(24, 20))
    background = Image.open(M_SOURCE_FILE).convert("RGBA")
    background.alpha_composite(qr_block, (78, 250))
    background.alpha_composite(text_block, (75, 620))

    png_buffer = io.BytesIO()
    background.save(png_buffer, format="PNG")
    png_buffer.seek(0)

    return png_buffer


def create_qr_code(ticket_id, font_path_bold, box_size=9):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=box_size,
        border=4,
    )
    qr.add_data(ticket_id)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#364921", back_color="transparent", image_factory=PilImage)
    if hasattr(img, 'get_image'):
        img = img.get_image()
    if not isinstance(img, Image.Image):
        buf = io.BytesIO()
        img.save(buf)
        buf.seek(0)
        img = Image.open(buf)

    # --- QR-код с подписью (ticket_id) ---
    font_size_id = box_size * 4 - 2
    try:
        font_id = ImageFont.truetype(font_path_bold, font_size_id)
    except IOError:
        font_id = ImageFont.load_default()

    bbox_id = font_id.getbbox(ticket_id)
    qr_w, qr_h = img.size
    qr_block_h = qr_h + (bbox_id[3] - bbox_id[1]) + 12
    qr_block = Image.new("RGBA", (int(qr_w), int(qr_block_h)), (255, 255, 255, 0))
    qr_block.paste(img, (0, 0))
    draw_qr = ImageDraw.Draw(qr_block)

    id_x = box_size * 4
    id_y = box_size * 30 - 20
    draw_qr.text((id_x, id_y), ticket_id, font=font_id, fill="#364921")

    return qr_block


def create_client_info(client_name, ticket_type, font_path, size=(36, 30)):
    # --- Текстовый блок справа ---
    font_size_name, font_size_type = size
    try:
        font_name = ImageFont.truetype(font_path, font_size_name)
        font_type = ImageFont.truetype(font_path, font_size_type)
    except IOError:
        font_name = font_type = ImageFont.load_default()

    name_lines = client_name.split(' ', 1) if ' ' in client_name else [client_name]
    name_bboxes = [font_name.getbbox(line) for line in name_lines]
    name_heights = [bbox[3] - bbox[1] for bbox in name_bboxes]


    text_block_w = 390
    text_block_h = 180
    text_block = Image.new("RGBA", (int(text_block_w), int(text_block_h)), (255, 255, 255, 0))
    draw_text = ImageDraw.Draw(text_block)
    cur_y = 10

    # if len(client_name) > 22:
    if len(client_name) > 1:
        for i, line in enumerate(name_lines):
            draw_text.text((0, cur_y), line, font=font_name, fill="#364921")
            cur_y += name_heights[i] + (6 if i < len(name_lines)-1 else 0)
    else:
        draw_text.text((0, cur_y), client_name, font=font_name, fill="#364921")

    draw_text.text((0, font_size_type * 4), ticket_type, font=font_type, fill="#364921")

    return text_block


def main():
    for ticket in TICKETS:
        generate_ticket(ticket["ticket_id"], ticket["client_name"], ticket["ticket_type"])
        generate_m_ticket(ticket["ticket_id"], ticket["client_name"], ticket["ticket_type"])

if __name__ == "__main__":
    main()

# Example usage:
# png_buf, pdf_buf = generate_ticket_buffers(
#     ticket_id="G-086-3730",
#     client_name="Elena Petrova",
#     ticket_type="Guest",
#     source_file=SOURCE_FILE,
#     font_path=FONT_PATH,
#     font_path_bold=FONT_PATH_BOLD,
#     as_pdf=True
# )
# Now you can send png_buf or pdf_buf as email attachments without saving to disk.
