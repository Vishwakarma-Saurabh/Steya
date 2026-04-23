"""Helper Functions and Dependencies"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import AuthService

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Dependency to get current authenticated user ID"""
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = credentials.credentials
    
    try:
        user_id = AuthService.get_user_id_from_token(token)
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str | None:
    """Dependency to get current user ID (optional - no error if not authenticated)"""
    
    if not credentials:
        return None
    
    token = credentials.credentials
    
    try:
        user_id = AuthService.get_user_id_from_token(token)
        return user_id
    except Exception:
        return None