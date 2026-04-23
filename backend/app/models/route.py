"""Travel Route Model"""
from sqlalchemy import Column, String, Text, DECIMAL, DateTime, Time, Boolean
from sqlalchemy.sql import func
from app.database import Base
from app.models.user import generate_id


class TravelRoute(Base):
    __tablename__ = "travel_routes"
    
    id = Column(String(50), primary_key=True, default=lambda: generate_id('rt'))
    user_id = Column(String(50), nullable=False)
    route_name = Column(String(100))
    start_address = Column(Text)
    start_latitude = Column(DECIMAL(10, 8), nullable=False)
    start_longitude = Column(DECIMAL(11, 8), nullable=False)
    end_address = Column(Text)
    end_latitude = Column(DECIMAL(10, 8), nullable=False)
    end_longitude = Column(DECIMAL(11, 8), nullable=False)
    typical_time = Column(Time)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())