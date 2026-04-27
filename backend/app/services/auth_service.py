from datetime import datetime, timedelta
import hashlib
import hmac
import secrets
from typing import Optional

from jose import JWTError, jwt

from app.config import settings


class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        salt = secrets.token_hex(16)
        iterations = 100000
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), iterations).hex()
        return f"pbkdf2_sha256${iterations}${salt}${digest}"

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            algorithm, iter_text, salt, expected = hashed_password.split("$", 3)
            if algorithm != "pbkdf2_sha256":
                return False
            iterations = int(iter_text)
            actual = hashlib.pbkdf2_hmac(
                "sha256", plain_password.encode(), salt.encode(), iterations
            ).hex()
            return hmac.compare_digest(actual, expected)
        except (ValueError, TypeError):
            return False

    @staticmethod
    def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
        if expires_delta:
            expire = datetime.now() + expires_delta
        else:
            expire = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        payload = {"sub": user_id, "exp": expire, "iat": datetime.now(), "type": "access"}
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def decode_token(token: str) -> dict:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError as exc:
            raise ValueError("Invalid or expired token") from exc

    @staticmethod
    def get_user_id_from_token(token: str) -> str:
        payload = AuthService.decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid token payload")
        return user_id