from datetime import datetime, timezone

from app.db.base import Base
from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(Integer, default=2, comment="1 - admin, 2 - moderator, 3 - user")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Form(Base):
    __tablename__ = "participation_forms"

    id = Column(Integer, primary_key=True)
    form_type = Column(String, nullable=True)

    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    social = Column(String, nullable=True)
    profession = Column(String, nullable=True)
    department = Column(String, nullable=True)
    country = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    program_direction = Column(String, nullable=True)
    program_description = Column(String, nullable=True)
    program_example = Column(String, nullable=True)
    event_dates = Column(String, nullable=True)
    quantity = Column(String, nullable=True)
    time = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    lang = Column(String, nullable=True)
    raider = Column(String, nullable=True)

    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


