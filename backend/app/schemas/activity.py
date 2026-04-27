from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ActivityCreate(BaseModel):
    event_type: str = Field(..., min_length=2, max_length=50)
    message: str = Field(..., min_length=3, max_length=300)
    metadata: dict[str, Any] = {}


class ActivityResponse(BaseModel):
    id: str
    event_type: str
    message: str
    metadata: dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
