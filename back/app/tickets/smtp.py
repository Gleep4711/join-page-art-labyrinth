import io
import os
import smtplib
from email.message import EmailMessage

from pathlib import Path
from typing import Dict, List, Optional

from app.config import settings
from pydantic import SecretStr

TICKET_PLAIN_TEMPLATE = """
Здравствуйте, {name}!
Спасибо, что сделали взнос на фестиваль Art Labyrinth!
Мы очень рады, что вы станете частью этого волшебного события.

В этом письме вы найдете ваше электронное приглашение:
📲 Мобильная версия
📄 PDF-файл для печати

Пожалуйста, предъявите одну из этих версий в Welcome-центре фестиваля при входе.

🎉 Также мы прикрепляем ссылку на программу фестиваля, чтобы вы могли заранее ознакомиться с расписанием событий и мероприятий:
https://fest.art-labyrinth.org

💡 Мы также рекомендуем вам взять с собой:
 🎒 Основное:
✔️ Палатка и коврик / каремат (чтобы комфортно спать)
✔️ Спальник или теплое одеяло
✔️ Легкая и удобная одежда + теплая одежда (вечером может быть прохладно)
✔️ Удобная обувь
✔️ Дождевик или плащ (на случай дождя)
✔️ Купальник или плавки (если будут водные активности)

💡 Для быта:
✔️ Фонарик / налобный фонарь + запасные батарейки
✔️ Личная аптечка (пластыри, йод, антигистаминные, репеллент от комаров и т.д.)
✔️ Многоразовая посуда: кружка, тарелка, ложка / вилка
✔️ Вода или бутылка для воды (на территории будут точки пополнения)
✔️ Полотенце,
✔️ Натуральные средства гигиены

🌿 Для участия в программе:
✔️ Музыкальные инструменты, если любишь играть
✔️ Костюм для перформансов, арт-объектов (если участвуешь!)
✔️ Блокнот или дневник (можно фиксировать впечатления)

✨ Для атмосферы:
✔️ Украшения, элементы костюма — для создания магического настроения
✔️ Открытое сердце и готовность к новым знакомствам и открытиям

🎉 Фестиваль Art Labyrinth — это пространство для творчества и самовыражения, так что бери то, что поможет тебе чувствовать себя свободно и вдохновенно!

Если у вас возникнут какие-либо вопросы, пожалуйста, свяжитесь с нами:
📧 info@art-labyrinth.org
💬 https://t.me/+wpqpF2uV3-IzZTQ6

До встречи в волшебном Лабиринте!
"""


TICKET_TEMPLATE = '''
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ваш билет на фестиваль Art Labyrinth</title>
</head>
<body style="font-family: Arial, sans-serif; color: #222; background: #fff;">
    <h2>Здравствуйте, {name}!</h2>
    <p>Спасибо, что сделали взнос на фестиваль <b>Art Labyrinth</b>!<br>
    Мы очень рады, что вы станете частью этого волшебного события.</p>
    <p>В этом письме вы найдете ваше электронное приглашение:</p>
    <ul>
        <li>📲 <b>Мобильная версия</b></li>
        <li>📄 <b>PDF-файл для печати</b></li>
    </ul>
    <p>Пожалуйста, предъявите одну из этих версий в Welcome-центре фестиваля при входе.</p>
    <img src="cid:ticket_image" alt="Ticket" style="max-width:100%;border:1px solid #ccc;">
    <img src="cid:static_image" alt="Rules" style="max-width:100%;border:1px solid #ccc;">
    <hr>
    <!--
        <p>🎉 Также мы прикрепляем ссылку на программу фестиваля, чтобы вы могли заранее ознакомиться с расписанием событий и мероприятий:<br>
            <a href="https://fest.art-labyrinth.org" style="color: #2a7ae2;">Программа фестиваля</a></p>
        <hr>
    -->
    <h3>💡 Мы также рекомендуем вам взять с собой:</h3>
    <ul>
        <li><b>🎒 Основное:</b>
            <ul>
                <li>✔️ Палатка и коврик / каремат (чтобы комфортно спать)</li>
                <li>✔️ Спальник или теплое одеяло</li>
                <li>✔️ Легкая и удобная одежда + теплая одежда (вечером может быть прохладно)</li>
                <li>✔️ Удобная обувь</li>
                <li>✔️ Дождевик или плащ (на случай дождя)</li>
                <li>✔️ Купальник или плавки (если будут водные активности)</li>
            </ul>
        </li>
        <li><b>💡 Для быта:</b>
            <ul>
                <li>✔️ Фонарик / налобный фонарь + запасные батарейки</li>
                <li>✔️ Личная аптечка (пластыри, йод, антигистаминные, репеллент от комаров и т.д.)</li>
                <li>✔️ Многоразовая посуда: кружка, тарелка, ложка / вилка</li>
                <li>✔️ Вода или бутылка для воды (на территории будут точки пополнения)</li>
                <li>✔️ Полотенце</li>
                <li>✔️ Натуральные средства гигиены</li>
            </ul>
        </li>
        <li><b>🌿 Для участия в программе:</b>
            <ul>
                <li>✔️ Музыкальные инструменты, если любишь играть</li>
                <li>✔️ Костюм для перформансов, арт-объектов (если участвуешь!)</li>
                <li>✔️ Блокнот или дневник (можно фиксировать впечатления)</li>
            </ul>
        </li>
        <li><b>✨ Для атмосферы:</b>
            <ul>
                <li>✔️ Украшения, элементы костюма — для создания магического настроения</li>
                <li>✔️ Открытое сердце и готовность к новым знакомствам и открытиям</li>
            </ul>
        </li>
    </ul>
    <hr>
    <p>🎉 <b>Фестиваль Art Labyrinth</b> — это пространство для творчества и самовыражения, так что бери то, что поможет тебе чувствовать себя свободно и вдохновенно!</p>
    <p>Если у вас возникнут какие-либо вопросы, пожалуйста, свяжитесь с нами:<br>
    📧 <a href="mailto:info@art-labyrinth.org">info@art-labyrinth.org</a><br>
    💬 <a href="https://t.me/+wpqpF2uV3-IzZTQ6">https://t.me/+wpqpF2uV3-IzZTQ6</a></p>
    <p>До встречи в волшебном Лабиринте!</p>
</body>
</html>
'''

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
        'subject': 'Art-Labyrinth Ticket',
        'body': '<h2>Здравствуйте, {name}!</h2><p>Спасибо за поддержку нашего фестиваля.</p>',
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

    def send_mail(self, to_email: str, template: str, context: Dict[str, str]):
        tpl = EMAIL_TEMPLATES[template]
        subject = str(tpl['subject']).format(**context) if isinstance(tpl['subject'], str) else ''
        body = str(tpl['body']).format(**context) if isinstance(tpl['body'], str) else ''
        is_html = tpl.get('is_html', False)

        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = self.user
        msg['To'] = to_email

        inline_images = []
        html_body = body
        # Сначала формируем текстовые части
        if is_html:
            try:
                msg.set_content(body, subtype='plain')
            except Exception as e:
                import traceback
                print('ERROR: set_content:', e)
                print(traceback.format_exc())
                raise
            try:
                msg.add_alternative(html_body, subtype='html')
            except Exception as e:
                import traceback
                print('ERROR: add_alternative:', e)
                print(traceback.format_exc())
                raise
            payload = msg.get_payload()
            if isinstance(payload, list) and len(payload) > 0:
                html_part = payload[-1]
                if isinstance(html_part, EmailMessage):
                    try:
                        for img in inline_images:
                            html_part.add_related(
                                img['data'],
                                maintype='image',
                                subtype='png',
                                cid=img['cid'],
                                filename=img['filename'],
                                disposition='inline'
                            )
                    except Exception as e:
                        import traceback
                        print('Ошибка при добавлении inline-изображения:', e)
                        print(traceback.format_exc())
                        raise
        else:
            try:
                msg.set_content(body)
            except Exception as e:
                import traceback
                print('ERROR: set_content (plain):', e)
                print(traceback.format_exc())
                raise

        try:
            with smtplib.SMTP(self.host, self.port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.user, self.password)
                server.send_message(msg)
        except Exception as e:
            import traceback
            print('Ошибка при отправке письма:', e)
            print(traceback.format_exc())
            raise

    def send_ticket_email(self, to_email: str, name: str, ticket_png: bytes, ticket_pdf: bytes):
        """
        Отправляет письмо с билетами:
        - ticket_png (bytes): PNG-файл билета, вставляется inline в тело письма и как вложение
        - ticket_pdf (bytes): PDF-файл билета, прикрепляется как вложение
        - SOURCE_FILE (png): статичное изображение, вставляется inline в тело письма
        """
        subject = 'Ваш входной билет на фестиваль "Art-Labyrinth"'
        # HTML-шаблон с двумя inline-изображениями
        html_body = TICKET_TEMPLATE.format(name=name)
        plain_body = TICKET_PLAIN_TEMPLATE.format(name=name)

        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = self.user
        msg['To'] = to_email

        # Сначала текстовые части
        msg.set_content(plain_body)
        msg.add_alternative(html_body, subtype='html')

        # Добавляем inline-изображения к html-альтернативе
        payload = msg.get_payload()
        if isinstance(payload, list) and len(payload) > 0:
            html_part = payload[-1]
            if isinstance(html_part, EmailMessage):
                # Основной билет
                html_part.add_related(
                    ticket_png,
                    maintype='image',
                    subtype='png',
                    cid='ticket_image',
                    filename='ticket.png',
                    disposition='inline'
                )
                # Статичное изображение
                with open(SOURCE_FILE, 'rb') as f:
                    static_png = f.read()
                html_part.add_related(
                    static_png,
                    maintype='image',
                    subtype='png',
                    cid='static_image',
                    filename='rules.png',
                    disposition='inline'
                )

        # Добавляем вложения
        msg.add_attachment(ticket_png, maintype='image', subtype='png', filename='ticket.png')
        with open(SOURCE_FILE, 'rb') as f:
            static_png = f.read()
        msg.add_attachment(static_png, maintype='image', subtype='png', filename='rules.png')
        msg.add_attachment(ticket_pdf, maintype='application', subtype='pdf', filename='ticket.pdf')

        try:
            with smtplib.SMTP(self.host, self.port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.user, self.password)
                server.send_message(msg)
        except Exception as e:
            import traceback
            print('Ошибка при отправке письма:', e)
            print(traceback.format_exc())
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
