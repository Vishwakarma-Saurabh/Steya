from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    title: str = Field(..., min_length=5)
    description: str = Field(..., min_length=20)
    price: Decimal
    price_type: str = Field(default="hourly", pattern="^(hourly|fixed)$")
    max_hours: int = Field(default=8, ge=1, le=24)
    address: str
    latitude: float
    longitude: float
    amenities: List[str] = []
    images: List[str] = []


class RoomResponse(BaseModel):
    id: str
    host_id: str
    title: str
    description: str
    price: Decimal
    price_type: str
    max_hours: int
    address: str
    latitude: Decimal
    longitude: Decimal
    amenities: List[str]
    images: List[str]
    is_active: bool
    rating: Decimal
    created_at: datetime

    class Config:
        from_attributes = True
