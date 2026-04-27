from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.route import TravelRoute
from app.models.user import User
from app.schemas.route import MatchResponse, RouteCreate, RouteResponse
from app.services.activity_service import ActivityService
from app.services.ml_service import MLService
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/routes/create", response_model=RouteResponse)
def create_route(
    payload: RouteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    route = TravelRoute(user_id=current_user.id, **payload.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    ActivityService.log(db, current_user.id, "route_create", f"Created route: {route.route_name}", {"route_id": route.id})
    return route


@router.get("/routes/my", response_model=list[RouteResponse])
def my_routes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(TravelRoute)
        .filter(TravelRoute.user_id == current_user.id, TravelRoute.is_active.is_(True))
        .order_by(TravelRoute.created_at.desc())
        .all()
    )


@router.post("/routes", response_model=MatchResponse)
def route_matches(
    payload: RouteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    temp_route = TravelRoute(user_id=current_user.id, **payload.model_dump())
    all_routes = db.query(TravelRoute).filter(TravelRoute.is_active.is_(True)).all()
    matches = MLService.find_route_matches(temp_route, all_routes)
    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No route matches found")
    ActivityService.log(
        db,
        current_user.id,
        "route_match_search",
        "Searched for route matches",
        {"matches_found": len(matches)},
    )
    return {"matches": matches}
