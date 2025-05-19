from datetime import datetime, timezone

from app.db.base import Base
from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(Integer, default=2, comment="1 - admin, 2 - moderator, 3 - user")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Form(Base):
    __tablename__ = "participation_forms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    form_type = Column(String, nullable=True)

    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    social = Column(String, nullable=True)
    profession = Column(String, nullable=True)
    department = Column(String, nullable=True)
    country = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    previously_participated = Column(String, nullable=True)
    program_direction = Column(String, nullable=True)
    program_description = Column(String, nullable=True)
    program_example = Column(String, nullable=True)
    event_dates = Column(String, nullable=True)
    quantity = Column(String, nullable=True)
    time = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    lang = Column(String, nullable=True)
    raider = Column(String, nullable=True)
    additional_info = Column(String, nullable=True)

    conditions = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    camping = Column(String, nullable=True)
    negative = Column(String, nullable=True)
    help_now = Column(Boolean, default=False)
    inspiration = Column(String, nullable=True)
    # raw_data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class Feedback(Base):
    __tablename__ = "feedback_forms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)
    dest = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    phone= Column(String, nullable=True)
    email = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    is_sold = Column(Boolean, default=False)
    is_used = Column(Boolean, default=False)
    comment = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String, unique=True, nullable=True)
    ticket_ids = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String, server_default="new")
    customer = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    comment = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))