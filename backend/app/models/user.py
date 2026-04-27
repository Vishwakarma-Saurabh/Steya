import uuid

from sqlalchemy import Boolean, Column, DateTime, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


def generate_id(prefix: str) -> str:
    """Generate unique ID with prefix"""
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=lambda: generate_id("usr"))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    user_type = Column(String(20), default="traveler")
    is_active = Column(Boolean, default=True)
    rating = Column(Numeric(3, 2), default=0.0)
    created_at = Column(DateTime, server_default=func.now())

    rooms = relationship("Room", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    routes = relationship("TravelRoute", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
    saved_rooms = relationship("SavedRoom", back_populates="user", cascade="all, delete-orphan")