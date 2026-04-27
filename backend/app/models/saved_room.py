from sqlalchemy import Column, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.user import generate_id


class SavedRoom(Base):
    __tablename__ = "saved_rooms"
    __table_args__ = (UniqueConstraint("user_id", "room_id", name="uq_saved_room_user_room"),)

    id = Column(String(50), primary_key=True, default=lambda: generate_id("sav"))
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    room_id = Column(String(50), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="saved_rooms")
    room = relationship("Room", back_populates="saved_by")
