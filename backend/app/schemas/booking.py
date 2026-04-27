from decimal import Decimal
from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, Field

class BookingCreate(BaseModel):
    room_id: str
    booking_date: date
    start_time: time
    end_time: time
    total_price: Decimal
    special_requests: Optional[str] = None


class BookingResponse(BaseModel):
    id: str
    user_id: str
    room_id: str
    booking_date: date
    start_time: time
    end_time: time
    total_price: Decimal
    status: str
    special_requests: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class BookingCancelResponse(BaseModel):
    message: str = Field(default="Booking cancelled successfully")