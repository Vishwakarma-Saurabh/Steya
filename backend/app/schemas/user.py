"""User Schemas for Request/Response Validation"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal


class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    user_type: str = Field(default="traveler", pattern="^(traveler|host|both)$")


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    user_type: Optional[str] = Field(None, pattern="^(traveler|host|both)$")


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    email: str
    name: str
    phone: Optional[str]
    user_type: str
    profile_image: Optional[str]
    rating: Decimal
    is_verified: bool
    created_at: str


class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LoginResponse(BaseModel):
    """Schema for login response"""
    id: str
    email: str
    name: str
    token: str
    user_type: str
    profile_image: Optional[str] = None