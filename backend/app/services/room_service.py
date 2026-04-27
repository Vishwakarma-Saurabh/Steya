from app.models.room import Room
from app.services.ml_service import MLService
from sqlalchemy.orm import Session


class RoomService:
    @staticmethod
    def search_nearby_rooms(db: Session, lat: float, lng: float, radius_km: float):
        rooms = db.query(Room).filter(Room.is_active.is_(True)).all()
        results = []
        for room in rooms:
            distance = MLService.haversine_distance(lat, lng, float(room.latitude), float(room.longitude))
            if distance <= radius_km:
                results.append((distance, room))
        results.sort(key=lambda item: item[0])
        return [room for _, room in results]
