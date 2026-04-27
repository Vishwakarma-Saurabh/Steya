from sqlalchemy import Column, Date, DateTime, ForeignKey, Numeric, String, Text, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.user import generate_id
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(50), primary_key=True, default=lambda: generate_id("bk"))
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    room_id = Column(String(50), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="confirmed")
    special_requests = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")