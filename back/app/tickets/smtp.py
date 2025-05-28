import io
import os
import smtplib
from email import encoders
from email.message import EmailMessage
from email.mime.base import MIMEBase
from email.utils import make_msgid
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.config import settings

# Example templates message
EMAIL_TEMPLATES: Dict[str, Dict[str, str | bool]] = {
    'factura': {
        'subject': 'Фактура №{invoice_number}',
        'body': 'Здравствуйте, {name}!\n\nПрикреплена ваша фактура №{invoice_number}.',
    },
    'thanks_coming': {
        'subject': 'Спасибо за регистрацию!',
        'body': '<h1>Спасибо за регистрацию!</h1><p>Здравствуйте, {name}!</p><p>Мы рады приветствовать вас в нашей системе.</p>',
        'is_html': True
    },
    'with_attachments': {
        'subject': 'Документы для вас',
        'body': '<h2>Здравствуйте, {name}!</h2><p>Во вложении три файла.</p>',
        'is_html': True
    }
}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_FILE = os.path.join(BASE_DIR, "M2.png")


class SMTPClient:
    def __init__(self, host: str, port: int, user: str, password: str, use_tls: bool = True):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.use_tls = use_tls

    def send_mail(self, to_email: str, template: str, context: Dict[str, str], attachments: Optional[List[Dict[str, io.BytesIO | str]]] = None):
        # attachments=[{'buffer': png_buffer, 'filename': 'ticket.png'}]
        tpl = EMAIL_TEMPLATES[template]
        subject = str(tpl['subject']).format(**context) if isinstance(tpl['subject'], str) else ''
        body = str(tpl['body']).format(**context) if isinstance(tpl['body'], str) else ''
        is_html = tpl.get('is_html', False)

        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = self.user
        msg['To'] = to_email
        if is_html:
            msg.add_alternative(body, subtype='html')
        else:
            msg.set_content(body)

        # Attachments: accept BytesIO or file-like objects with filename
        if attachments:
            path = Path(SOURCE_FILE)
            with open(path, 'rb') as f:
                msg.add_attachment(f.read(), maintype='application', subtype='octet-stream', filename=path.name)
            for att in attachments:
                if isinstance(att, dict) and 'buffer' in att and 'filename' in att:
                    # Handle dict with 'buffer' and 'filename'
                    if isinstance(att['buffer'], io.BytesIO):
                        buf = att['buffer']
                        filename = att['filename']
                        buf.seek(0)
                        maintype = 'application'
                        subtype = 'octet-stream'
                        msg.add_attachment(buf, maintype='application', subtype='octet-stream', filename=filename)
                elif hasattr(att, 'read') and hasattr(att, 'name'):
                    # Fallback for file-like objects with .name
                    if isinstance(att, io.BytesIO):
                        buf = att
                        filename = getattr(att, 'name', 'attachment.bin')
                        buf.seek(0)
                        maintype = 'application'
                        subtype = 'octet-stream'
                        msg.add_attachment(buf.read(), maintype=maintype, subtype=subtype, filename=filename)
                elif isinstance(att, str):
                    # Legacy: file path
                    path = Path(att)
                    with open(path, 'rb') as f:
                        msg.add_attachment(f.read(), maintype='application', subtype='octet-stream', filename=path.name)

        with smtplib.SMTP(self.host, self.port) as server:
            if self.use_tls:
                server.starttls()
            server.login(self.user, self.password)
            server.send_message(msg)

# Example of the client’s initialization (parameters should be in settings)
smtp_client = SMTPClient(
    host=getattr(settings, 'SMTP_HOST', 'smtp.example.com'),
    port=int(getattr(settings, 'SMTP_PORT', 587)),
    user=getattr(settings, 'SMTP_USER', 'user@example.com'),
    password=getattr(settings, 'SMTP_PASSWORD', 'password'),
    use_tls=True
)

# Example of use:
# smtp_client.send_mail(
#     to_email='recipient@example.com',
#     template='with_attachments',
#     context={'name': 'Ivan'},
#     attachments=['/path/to/file1.pdf', '/path/to/file2.pdf', '/path/to/file3.pdf']
# )
