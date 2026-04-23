"""Authentication Routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, LoginResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=LoginResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength
    is_strong, message = AuthService.validate_password_strength(user_data.password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        password_hash=AuthService.hash_password(user_data.password),
        name=user_data.name,
        phone=user_data.phone,
        user_type=user_data.user_type
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate access token
    token = AuthService.create_access_token(new_user.id)
    
    return LoginResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        token=token,
        user_type=new_user.user_type,
        profile_image=new_user.profile_image
    )


@router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token"""
    
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # Verify user exists and password is correct
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    if not AuthService.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate access token
    token = AuthService.create_access_token(user.id)
    
    return LoginResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        token=token,
        user_type=user.user_type,
        profile_image=user.profile_image
    )


@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}