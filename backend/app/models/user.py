"""User Model"""
from sqlalchemy import Column, String, DateTime, DECIMAL, Boolean
from sqlalchemy.sql import func
from app.database import Base
import uuid


def generate_id(prefix: str) -> str:
    """Generate unique ID with prefix"""
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


class User(Base):
    """User model for hosts and travelers"""
    
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True, default=lambda: generate_id('usr'))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    profile_image = Column(String(500))
    user_type = Column(String(20), default="traveler")
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    rating = Column(DECIMAL(3, 2), default=0.00)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    def __repr__(self):
        return f"<User {self.email}>"