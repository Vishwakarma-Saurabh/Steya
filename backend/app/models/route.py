from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.user import generate_id

class TravelRoute(Base):
    __tablename__ = "travel_routes"

    id = Column(String(50), primary_key=True, default=lambda: generate_id("rt"))
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    route_name = Column(String(100), nullable=False)
    start_address = Column(Text, nullable=False)
    start_latitude = Column(Numeric(10, 8), nullable=False)
    start_longitude = Column(Numeric(11, 8), nullable=False)
    end_address = Column(Text, nullable=False)
    end_latitude = Column(Numeric(10, 8), nullable=False)
    end_longitude = Column(Numeric(11, 8), nullable=False)
    typical_time = Column(String(30), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="routes")