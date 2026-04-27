from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel


class RouteCreate(BaseModel):
    route_name: str
    start_address: str
    start_latitude: float
    start_longitude: float
    end_address: str
    end_latitude: float
    end_longitude: float
    typical_time: str | None = None


class RouteResponse(BaseModel):
    id: str
    user_id: str
    route_name: str
    start_address: str
    start_latitude: Decimal
    start_longitude: Decimal
    end_address: str
    end_latitude: Decimal
    end_longitude: Decimal
    typical_time: str | None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MatchResult(BaseModel):
    user_id: str
    route_id: str
    route_name: str
    compatibility_score: float
    start_distance_km: float
    end_distance_km: float


class MatchResponse(BaseModel):
    matches: List[MatchResult]
