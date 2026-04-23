"""Booking Service - Business Logic"""
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.booking import Booking
from app.models.room import Room


class BookingService:
    
    @staticmethod
    def create_booking(db: Session, user_id: str, booking_data) -> Booking:
        """Create a new booking"""
        start_time = datetime.strptime(booking_data.start_time, "%H:%M").time()
        end_time = datetime.strptime(booking_data.end_time, "%H:%M").time()
        
        booking = Booking(
            user_id=user_id,
            room_id=booking_data.room_id,
            booking_date=booking_data.booking_date,
            start_time=start_time,
            end_time=end_time,
            total_price=booking_data.total_price,
            special_requests=booking_data.special_requests
        )
        
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    
    @staticmethod
    def get_user_bookings(db: Session, user_id: str) -> list:
        """Get all bookings for a user"""
        bookings = db.query(Booking, Room).join(
            Room, Booking.room_id == Room.id
        ).filter(
            Booking.user_id == user_id
        ).order_by(Booking.booking_date.desc()).all()
        
        result = []
        for booking, room in bookings:
            result.append({
                "id": booking.id,
                "room_id": room.id,
                "room_title": room.title,
                "room_address": room.address,
                "booking_date": str(booking.booking_date),
                "start_time": str(booking.start_time),
                "end_time": str(booking.end_time),
                "total_price": float(booking.total_price),
                "status": booking.status
            })
        
        return result
    
    @staticmethod
    def cancel_booking(db: Session, booking_id: str, user_id: str) -> bool:
        """Cancel a booking"""
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        
        if not booking:
            return False
        
        if booking.user_id != user_id:
            return False
        
        if booking.status == "cancelled":
            return False
        
        booking.status = "cancelled"
        booking.cancelled_at = datetime.utcnow()
        db.commit()
        
        return True