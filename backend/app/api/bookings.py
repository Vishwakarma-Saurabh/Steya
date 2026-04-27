from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.booking import BookingCancelResponse, BookingCreate, BookingResponse
from app.services.activity_service import ActivityService
from app.services.booking_service import BookingService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("", response_model=BookingResponse)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        booking = BookingService.create_booking(db, current_user.id, payload)
        ActivityService.log(
            db,
            current_user.id,
            "booking_create",
            "Created a booking",
            {"booking_id": booking.id, "room_id": booking.room_id},
        )
        return booking
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("", response_model=list[BookingResponse])
def my_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return BookingService.get_user_bookings(db, current_user.id)


@router.post("/{booking_id}/cancel", response_model=BookingCancelResponse)
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cancelled = BookingService.cancel_booking(db, booking_id, current_user.id)
    if not cancelled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found or already cancelled")
    ActivityService.log(
        db,
        current_user.id,
        "booking_cancel",
        "Cancelled a booking",
        {"booking_id": booking_id},
    )
    return {"message": "Booking cancelled successfully"}
