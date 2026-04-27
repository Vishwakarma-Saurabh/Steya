from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_bookings: int
    active_bookings: int
    cancelled_bookings: int
    total_spend: float
    total_rooms_listed: int
    total_saved_rooms: int
    total_routes: int
    recent_activity_count: int
