from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity import UserActivity
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.services.activity_service import ActivityService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/track", response_model=ActivityResponse)
def track_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = ActivityService.log(
        db=db,
        user_id=current_user.id,
        event_type=payload.event_type,
        message=payload.message,
        metadata=payload.metadata,
    )
    return {
        "id": activity.id,
        "event_type": activity.event_type,
        "message": activity.message,
        "metadata": activity.event_metadata or {},
        "created_at": activity.created_at,
    }


@router.get("/my", response_model=list[ActivityResponse])
def my_activity(
    limit: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activities = (
        db.query(UserActivity)
        .filter(UserActivity.user_id == current_user.id)
        .order_by(UserActivity.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": activity.id,
            "event_type": activity.event_type,
            "message": activity.message,
            "metadata": activity.event_metadata or {},
            "created_at": activity.created_at,
        }
        for activity in activities
    ]
