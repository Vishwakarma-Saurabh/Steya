from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import TokenResponse, UserLogin, UserRegister
from app.services.activity_service import ActivityService
from app.services.auth_service import AuthService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user = User(
        email=payload.email,
        password_hash=AuthService.hash_password(payload.password),
        name=payload.name,
        phone=payload.phone,
        user_type=payload.user_type,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    ActivityService.log(db, user.id, "auth_register", "New account created", {"email": user.email})
    token = AuthService.create_access_token(
        user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email, User.is_active.is_(True)).first()
    if not user or not AuthService.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    ActivityService.log(db, user.id, "auth_login", "User logged in")
    token = AuthService.create_access_token(
        user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return current_user
