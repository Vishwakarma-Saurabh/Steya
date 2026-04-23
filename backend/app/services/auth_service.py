"""Authentication Service"""
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
from app.config import config

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain text password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against hashed password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        }
        
        return jwt.encode(payload, config.SECRET_KEY, algorithm=config.ALGORITHM)
    
    @staticmethod
    def decode_token(token: str) -> dict:
        """Decode and verify JWT token"""
        try:
            payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.JWTError:
            raise Exception("Invalid token")
    
    @staticmethod
    def get_user_id_from_token(token: str) -> str:
        """Extract user ID from token"""
        payload = AuthService.decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise Exception("Invalid token payload")
        return user_id
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one number"
        return True, "Password is strong"