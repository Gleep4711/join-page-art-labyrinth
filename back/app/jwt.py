import datetime
import logging
from typing import NotRequired, TypedDict

from app.config import settings
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


class JWTPayload(TypedDict):
    id: int
    name: str
    role: str
    ip: str
    exp: NotRequired[datetime.timedelta]
    token: NotRequired[str]


async def create_access_token(data: dict) -> JWTPayload:
    to_encode = data.copy()

    to_encode.update({
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    })

    data.update({
        "token": jwt.encode(to_encode, settings.JWT_SECRET.get_secret_value(), algorithm=settings.ALGORITHM)
    })
    return JWTPayload(**data)


async def verify_token(request: Request, token: str = Depends(oauth2_scheme)) -> JWTPayload:
    try:
        payload: dict = jwt.decode(str(token), settings.JWT_SECRET.get_secret_value(), algorithms=[settings.ALGORITHM])
        username: str = payload.get("name", "")
        if username is None or payload.get("ip") != request.headers.get("CF-Connecting-IP", request.client.host if request.client else 'unknown'):
            raise credentials_exception
        return JWTPayload(**payload)
    except JWTError:
        raise credentials_exception
