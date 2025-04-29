import logging

from app.api import feedback, forms, root_route
from app.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=getattr(logging, settings.LOGGING.upper(), logging.ERROR),
    format="%(levelname)s: %(filename)s:%(lineno)d: %(message)s",
)

app = FastAPI(
    title="Art-Labyrinth",
    docs_url=None,
    redoc_url=None
)

app.include_router(root_route.router, tags=["Main"], prefix="")
app.include_router(forms.router, tags=["Form"], prefix="/form")
app.include_router(feedback.router, tags=["Feedback"], prefix="/feedback")

if settings.DEV_MODE:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
