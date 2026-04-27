from app.models.booking import Booking
from app.models.room import Room
from sqlalchemy.orm import Session


class BookingService:
    @staticmethod
    def create_booking(db: Session, user_id: str, booking_data) -> Booking:
        room = db.query(Room).filter(Room.id == booking_data.room_id, Room.is_active.is_(True)).first()
        if not room:
            raise ValueError("Room not found")
        if booking_data.start_time >= booking_data.end_time:
            raise ValueError("End time must be greater than start time")

        booking = Booking(
            user_id=user_id,
            room_id=booking_data.room_id,
            booking_date=booking_data.booking_date,
            start_time=booking_data.start_time,
            end_time=booking_data.end_time,
            total_price=booking_data.total_price,
            special_requests=booking_data.special_requests,
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking

    @staticmethod
    def get_user_bookings(db: Session, user_id: str) -> list[Booking]:
        return (
            db.query(Booking)
            .filter(Booking.user_id == user_id)
            .order_by(Booking.booking_date.desc(), Booking.start_time.desc())
            .all()
        )

    @staticmethod
    def cancel_booking(db: Session, booking_id: str, user_id: str) -> bool:
        booking = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == user_id).first()
        if not booking:
            return False
        if booking.status == "cancelled":
            return False
        booking.status = "cancelled"
        db.commit()
        return True