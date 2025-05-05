import logging

from app.api import feedback, forms, payment, root_route, login
from app.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=getattr(logging, settings.LOGGING.upper(), logging.ERROR),
    format="%(levelname)s: %(filename)s:%(lineno)d: %(message)s",
)

options = {
    "title": "Art-Labyrinth",
    "description": "API for Art-Labyrinth project",
    "contact": {
        "name": "Art-Labyrinth Team",
        "url": "https://art-labyrinth.org",
        "email": "team.art-labyrinth.org",
    },
}
if not settings.DEV_MODE:
    options["docs_url"] = None
    options["redoc_url"] = None

app = FastAPI(**options)

app.include_router(root_route.router, tags=["Main"], prefix="")
app.include_router(forms.router, tags=["Form"], prefix="/form")
app.include_router(feedback.router, tags=["Feedback"], prefix="/feedback")
app.include_router(payment.router, tags=["Payment"], prefix="")
app.include_router(login.router, tags=["Login"], prefix="/user")

if settings.DEV_MODE:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
