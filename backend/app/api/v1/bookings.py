"""Booking Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.room import Room
from app.schemas.booking import BookingCreate
from app.services.booking_service import BookingService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/", status_code=201)
def create_booking(
    booking_data: BookingCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new booking"""
    room = db.query(Room).filter(Room.id == booking_data.room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    booking = BookingService.create_booking(db, current_user, booking_data)
    
    return {
        "id": booking.id,
        "message": "Booking confirmed",
        "status": booking.status
    }


@router.get("/")
def get_bookings(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's bookings"""
    bookings = BookingService.get_user_bookings(db, current_user)
    return {"bookings": bookings}


@router.post("/{booking_id}/cancel")
def cancel_booking(
    booking_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a booking"""
    success = BookingService.cancel_booking(db, booking_id, current_user)
    
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found or cannot be cancelled")
    
    return {"message": "Booking cancelled successfully"}