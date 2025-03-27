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
    form_type = Column(String, nullable=True)           # Type of form: "volunteer" or "master"
    name = Column(String, nullable=True)                # Name (for the shape of a volunteer)
    age = Column(Integer, nullable=True)                # Age (for volunteer shape)
    phone = Column(String, nullable=True)               # Phone (for volunteer shape)
    profession = Column(String, nullable=True)          # Profession (for volunteer uniforms)
    department = Column(String, nullable=True)          # Department (for the form of a volunteer)
    program_direction = Column(String, nullable=True)   # Direction of the program (for the form of the master)
    program_description = Column(String, nullable=True) # Program description (for the form of the master)
    event_dates = Column(String, nullable=True)         # Dates of the event (for the form of the master)
    raw_data = Column(JSON, nullable=True)             # Full data format in json format

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
