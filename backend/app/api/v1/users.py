"""User Profile Routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.utils.helpers import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    
    user = db.query(User).filter(User.id == current_user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        user_type=user.user_type,
        profile_image=user.profile_image,
        rating=float(user.rating),
        is_verified=user.is_verified,
        created_at=str(user.created_at)
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get public user profile by ID"""
    
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone if user.user_type in ["host", "both"] else None,
        user_type=user.user_type,
        profile_image=user.profile_image,
        rating=float(user.rating),
        is_verified=user.is_verified,
        created_at=str(user.created_at)
    )


@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    
    user = db.query(User).filter(User.id == current_user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update only provided fields
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.profile_image is not None:
        user.profile_image = user_update.profile_image
    if user_update.user_type is not None:
        user.user_type = user_update.user_type
    
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        user_type=user.user_type,
        profile_image=user.profile_image,
        rating=float(user.rating),
        is_verified=user.is_verified,
        created_at=str(user.created_at)
    )