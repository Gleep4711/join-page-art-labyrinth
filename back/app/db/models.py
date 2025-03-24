from datetime import datetime, timezone

from app.db.base import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(Integer, default=2, comment="1 - admin, 2 - moderator, 3 - user")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
