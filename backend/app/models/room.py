from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.user import generate_id


class Room(Base):
    __tablename__ = "rooms"

    id = Column(String(50), primary_key=True, default=lambda: generate_id("rm"))
    host_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    price_type = Column(String(20), default="hourly")
    max_hours = Column(Integer, default=8)
    address = Column(Text, nullable=False)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    amenities = Column(JSONB, default=list)
    images = Column(JSONB, default=list)
    is_active = Column(Boolean, default=True)
    rating = Column(Numeric(3, 2), default=0.0)
    created_at = Column(DateTime, server_default=func.now())

    host = relationship("User", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room", cascade="all, delete-orphan")
    saved_by = relationship("SavedRoom", back_populates="room", cascade="all, delete-orphan")
