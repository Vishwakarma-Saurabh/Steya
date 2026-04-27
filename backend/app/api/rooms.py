from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.room import Room
from app.models.saved_room import SavedRoom
from app.models.user import User
from app.schemas.room import RoomCreate, RoomResponse
from app.services.activity_service import ActivityService
from app.services.room_service import RoomService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.get("", response_model=list[RoomResponse])
def search_rooms(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(5, gt=0),
    db: Session = Depends(get_db),
):
    return RoomService.search_nearby_rooms(db, lat, lng, radius)


@router.get("/{room_id}", response_model=RoomResponse)
def room_details(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id, Room.is_active.is_(True)).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room


@router.post("", response_model=RoomResponse)
def create_room(payload: RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = Room(
        host_id=current_user.id,
        title=payload.title,
        description=payload.description,
        price=payload.price,
        price_type=payload.price_type,
        max_hours=payload.max_hours,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        amenities=payload.amenities,
        images=payload.images,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    ActivityService.log(db, current_user.id, "room_create", f"Created listing: {room.title}", {"room_id": room.id})
    return room


@router.delete("/{room_id}")
def delete_room(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = db.query(Room).filter(Room.id == room_id, Room.host_id == current_user.id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    room.is_active = False
    db.commit()
    ActivityService.log(db, current_user.id, "room_delete", f"Deleted listing: {room.title}", {"room_id": room.id})
    return {"message": "Room deleted successfully"}


@router.post("/{room_id}/save")
def save_room(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = db.query(Room).filter(Room.id == room_id, Room.is_active.is_(True)).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    existing = (
        db.query(SavedRoom)
        .filter(SavedRoom.user_id == current_user.id, SavedRoom.room_id == room_id)
        .first()
    )
    if existing:
        return {"message": "Room already saved"}
    saved = SavedRoom(user_id=current_user.id, room_id=room_id)
    db.add(saved)
    db.commit()
    ActivityService.log(db, current_user.id, "room_saved", f"Saved room: {room.title}", {"room_id": room.id})
    return {"message": "Room saved"}


@router.delete("/{room_id}/save")
def unsave_room(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = (
        db.query(SavedRoom)
        .filter(SavedRoom.user_id == current_user.id, SavedRoom.room_id == room_id)
        .first()
    )
    if not saved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved room not found")
    db.delete(saved)
    db.commit()
    ActivityService.log(db, current_user.id, "room_unsaved", "Removed saved room", {"room_id": room_id})
    return {"message": "Room removed from saved"}


@router.get("/saved/me", response_model=list[RoomResponse])
def my_saved_rooms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved_entries = (
        db.query(SavedRoom).filter(SavedRoom.user_id == current_user.id).order_by(SavedRoom.created_at.desc()).all()
    )
    room_ids = [entry.room_id for entry in saved_entries]
    if not room_ids:
        return []
    rooms = db.query(Room).filter(Room.id.in_(room_ids), Room.is_active.is_(True)).all()
    rooms_by_id = {room.id: room for room in rooms}
    return [rooms_by_id[room_id] for room_id in room_ids if room_id in rooms_by_id]
