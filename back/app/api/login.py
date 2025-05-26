import logging
from typing import Optional

from app.db.base import get_db
from app.db.models import User
from app.jwt import JWTPayload, create_access_token, create_token, verify_token
from fastapi import APIRouter, Depends
from fastapi import Form as FastForm
from fastapi import HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
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
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
    username: str = FastForm(None),
    password: str = FastForm(None),
):
    try:
        if username or password:
            data = LoginRequest(
                username=username,
                password=password
            )
        else:
            data = LoginRequest(**(await request.json()))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")

    if not data.username or not data.password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    query = await db.execute(
        select(User).where(User.username == data.username)
    )
    user: User = query.scalar_one_or_none()

    if not user or not check_password_hash(str(user.password_hash), data.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not bool(user.is_active):
        raise HTTPException(status_code=403, detail="User is inactive")

    jwt_data = {
        "id": user.id,
        "name": user.username,
        "role": user.role,
        "ip": request.headers.get("CF-Connecting-IP", request.client.host if request.client else 'unknown'),
    }

    access_token = await create_access_token(jwt_data)

    redirect_url = "dashboard"
    if str(user.username) == "VolnaFest":
        redirect_url = "volunteers"
    elif str(user.username) == "MuzArt":
        redirect_url = "masters"

    if username:
        logging.info(f"User {user.username} logged in from {request.headers.get('CF-Connecting-IP', request.client.host if request.client else 'unknown')}")
        # return {"access_token": access_token.get("token"), "token_type": "bearer"}

    return {"access_token": access_token, "token": access_token.get("token"), "token_type": "bearer", "redirect_url": redirect_url}

@router.post("/auth")
async def auth(
    request: Request,
    db: AsyncSession = Depends(get_db),
    username: str = FastForm(None),
    password: str = FastForm(None),

):
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")
    query = await db.execute(
        select(User).where(User.username == username)
    )
    user: User = query.scalar_one_or_none()
    if not user or not check_password_hash(str(user.password_hash), password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not bool(user.is_active):
        raise HTTPException(status_code=403, detail="User is inactive")
    jwt_data = {
        "id": user.id,
        "name": user.username,
        "role": user.role,
        "ip": request.headers.get("CF-Connecting-IP", request.client.host if request.client else 'unknown'),
    }
    access_token = await create_token(jwt_data)

    role = "admin" if int(str(user.role)) == 1 else "user"
    redirect_url = "dashboard"
    if str(user.username) == "VolnaFest":
        role = "volunteer"
        redirect_url = "volunteers"
    elif str(user.username) == "MuzArt":
        role = "master"
        redirect_url = "masters"


    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role_id": user.role,
        "role": role,
        "redirect_url": redirect_url,
    }



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
    if current_user.get("role") != 1:
        raise HTTPException(status_code=403, detail="Not authorized")

    query = await db.execute(select(User).where(User.id == user_id))
    user = query.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.username:
        setattr(user, "username", request.username)
    if request.password:
        setattr(user, "password_hash", generate_password_hash(request.password))
    if request.role is not None:
        setattr(user, "role", request.role)

    await db.commit()
    return {"message": "User updated successfully"}
