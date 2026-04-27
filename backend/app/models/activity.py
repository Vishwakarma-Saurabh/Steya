from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.user import generate_id


class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(String(50), primary_key=True, default=lambda: generate_id("act"))
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    message = Column(Text, nullable=False)
    event_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="activities")
