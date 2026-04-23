"""Booking Model"""
from sqlalchemy import Column, String, Date, Time, DECIMAL, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base
from app.models.user import generate_id


class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String(50), primary_key=True, default=lambda: generate_id('bk'))
    user_id = Column(String(50), nullable=False)
    room_id = Column(String(50), nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(20), default="confirmed")
    special_requests = Column(Text)
    created_at = Column(DateTime, server_default=func.now())