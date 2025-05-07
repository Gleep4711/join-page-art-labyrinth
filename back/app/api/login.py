import logging
from typing import Optional
from app.config import settings
from app.db.base import get_db
from app.db.models import User
from app.jwt import JWTPayload, create_access_token, verify_token
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

router = APIRouter()


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username must be between 3 and 50 characters")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")


class UserCreateRequest(BaseModel):
    username: str
    password: str
    role: int


class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[int] = None


@router.post("/login")
async def login(request: Request, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    if not data.username or not data.password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    query = await db.execute(
        select(User).where(User.username == data.username)
    )
    user: User = query.scalar_one_or_none()

    if not user or not check_password_hash(user.password_hash, data.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    jwt_data = {
        "name": user.username,
        "role": user.role,
        "ip": request.headers.get("CF-Connecting-IP", request.client.host)
    }
    access_token = await create_access_token(data=jwt_data)

    redirect_url = "dashboard"
    if user.username == "VolnaFest":
        redirect_url = "volunteers"
    elif user.username == "MuzArt":
        redirect_url = "masters"

    return {"access_token": access_token, "token_type": "bearer", redirect_url: redirect_url}


@router.post("/add")
async def add_user(
    request: UserCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: JWTPayload = Depends(verify_token)
):
    if current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Not authorized")

    query = await db.execute(
        select(User).where(User.username == request.username)
    )
    existing_user = query.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=request.username,
        password_hash=generate_password_hash(request.password),
        role=request.role,
        is_active=True
    )
    db.add(new_user)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error: duplicate entry") from e

    return {"message": "User added successfully"}


@router.put("/edit/{user_id}")
async def edit_user(
    user_id: int,
    request: UserUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(verify_token)
):
    if current_user.get("role") != 1:  # Only admin can edit users
        raise HTTPException(status_code=403, detail="Not authorized")

    query = await db.execute(select(User).where(User.id == user_id))
    user = query.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.username:
        user.username = request.username
    if request.password:
        user.password_hash = generate_password_hash(request.password)
    if request.role is not None:
        user.role = request.role

    await db.commit()
    return {"message": "User updated successfully"}
