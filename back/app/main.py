import logging

from back.app.api import root_route
from app.config import settings
from fastapi import FastAPI

logging.basicConfig(
    level=getattr(logging, settings.logging.upper(), logging.ERROR),
    format="%(levelname)s: %(filename)s:%(lineno)d: %(message)s",
)

app = FastAPI()

app.include_router(root_route.router, tags=["main"], prefix="")
