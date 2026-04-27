from sqlalchemy import func
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity import UserActivity
from app.models.booking import Booking
from app.models.room import Room
from app.models.route import TravelRoute
from app.models.saved_room import SavedRoom
from app.models.user import User
from app.schemas.dashboard import DashboardSummaryResponse
from app.utils.helpers import get_current_user

router = APIRouter()


@router.get("/summary", response_model=DashboardSummaryResponse)
def summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    booking_rows = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    total_bookings = len(booking_rows)
    cancelled_bookings = sum(1 for booking in booking_rows if booking.status == "cancelled")
    active_bookings = total_bookings - cancelled_bookings
    total_spend = float(sum(float(booking.total_price) for booking in booking_rows))
    total_rooms_listed = db.query(func.count(Room.id)).filter(Room.host_id == current_user.id).scalar() or 0
    total_saved_rooms = db.query(func.count(SavedRoom.id)).filter(SavedRoom.user_id == current_user.id).scalar() or 0
    total_routes = db.query(func.count(TravelRoute.id)).filter(TravelRoute.user_id == current_user.id).scalar() or 0
    recent_activity_count = (
        db.query(func.count(UserActivity.id)).filter(UserActivity.user_id == current_user.id).scalar() or 0
    )

    return {
        "total_bookings": total_bookings,
        "active_bookings": active_bookings,
        "cancelled_bookings": cancelled_bookings,
        "total_spend": total_spend,
        "total_rooms_listed": total_rooms_listed,
        "total_saved_rooms": total_saved_rooms,
        "total_routes": total_routes,
        "recent_activity_count": recent_activity_count,
    }
