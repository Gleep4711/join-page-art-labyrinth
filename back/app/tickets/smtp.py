import io
import logging
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import Dict, List, Optional

from app.config import settings
from pydantic import SecretStr

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
    def __init__(self, host: str, port: int, user: str, password: SecretStr, use_tls: bool = True):
        self.host = host
        self.port = port
        self.user = user
        self.password = password.get_secret_value() if isinstance(password, SecretStr) else password
        self.use_tls = use_tls
        self.logger = logging.getLogger("smtp_client")

    def send_mail(self, to_email: str, template: str, context: Dict[str, str], attachments: Optional[List[Dict[str, io.BytesIO | str]]] = None):
        self.logger.info(f"Preparing to send email to {to_email} with template '{template}' and context {context}")
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

        if attachments:
            self.logger.info(f"Attachments count: {len(attachments)}")
            for att in attachments:
                self.logger.info(f"Processing attachment: {att}")
                if isinstance(att, dict) and 'buffer' in att and 'filename' in att:
                    if isinstance(att['buffer'], io.BytesIO):
                        buf = att['buffer']
                        filename = att['filename']
                        buf.seek(0)
                        maintype = 'application'
                        subtype = 'octet-stream'
                        data = buf.read()
                        self.logger.info(f"Adding BytesIO attachment: {filename}, size={len(data)} bytes")
                        msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=filename)
                elif hasattr(att, 'read') and hasattr(att, 'name'):
                    if isinstance(att, io.BytesIO):
                        buf = att
                        filename = getattr(att, 'name', 'attachment.bin')
                        buf.seek(0)
                        maintype = 'application'
                        subtype = 'octet-stream'
                        data = buf.read()
                        self.logger.info(f"Adding file-like attachment: {filename}, size={len(data)} bytes")
                        msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=filename)
                elif isinstance(att, str):
                    path = Path(att)
                    with open(path, 'rb') as f:
                        file_data = f.read()
                        self.logger.info(f"Adding file path attachment: {path.name}, size={len(file_data)} bytes")
                        msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=path.name)

        self.logger.info(f"Connecting to SMTP server {self.host}:{self.port} as {self.user}")
        try:
            with smtplib.SMTP(self.host, self.port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.user, self.password)
                server.send_message(msg)
            self.logger.info(f"Email sent to {to_email} successfully.")
        except Exception as e:
            self.logger.error(f"Failed to send email to {to_email}: {e}")
            raise

# Example of the client’s initialization (parameters should be in settings)
smtp_client = SMTPClient(
    host=getattr(settings, 'SMTP_HOST', 'smtp.example.com'),
    port=int(getattr(settings, 'SMTP_PORT', 587)),
    user=getattr(settings, 'SMTP_USER', 'user@example.com'),
    password=getattr(settings, 'SMTP_PASSWORD', SecretStr('password')),
    use_tls=True
)

# Example of use:
# smtp_client.send_mail(
#     to_email='recipient@example.com',
#     template='with_attachments',
#     context={'name': 'Ivan'},
#     attachments=['/path/to/file1.pdf', '/path/to/file2.pdf', '/path/to/file3.pdf']
# )
