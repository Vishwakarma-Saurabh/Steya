"""Booking Schemas"""
from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional


class BookingCreate(BaseModel):
    room_id: str
    booking_date: date
    start_time: str
    end_time: str
    total_price: Decimal
    special_requests: Optional[str] = None


class BookingResponse(BaseModel):
    id: str
    room_id: str
    room_title: str
    room_address: str
    booking_date: date
    start_time: str
    end_time: str
    total_price: Decimal
    status: str