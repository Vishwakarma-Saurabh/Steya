from typing import Any

from sqlalchemy.orm import Session

from app.models.activity import UserActivity


class ActivityService:
    @staticmethod
    def log(db: Session, user_id: str, event_type: str, message: str, metadata: dict[str, Any] | None = None):
        activity = UserActivity(
            user_id=user_id,
            event_type=event_type,
            message=message,
            event_metadata=metadata or {},
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
