"""Smart Matching Routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models.route import TravelRoute
from app.models.user import User
from app.services.ml_service import MLService
from app.utils.helpers import get_current_user

router = APIRouter()


class Location(BaseModel):
    lat: float
    lng: float


class RouteMatchRequest(BaseModel):
    start_location: Location
    end_location: Location


class RouteCreate(BaseModel):
    route_name: str
    start_address: str
    start_location: Location
    end_address: str
    end_location: Location
    typical_time: str = "09:00"


@router.post("/routes")
def find_matches(
    route_data: RouteMatchRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Find users with opposite commute routes"""
    routes = db.query(TravelRoute, User.name).join(
        User, TravelRoute.user_id == User.id
    ).filter(
        TravelRoute.is_active == True
    ).all()
    
    all_routes = []
    for route, user_name in routes:
        all_routes.append({
            'user_id': route.user_id,
            'user_name': user_name,
            'route_name': route.route_name,
            'start_lat': float(route.start_latitude),
            'start_lng': float(route.start_longitude),
            'start_address': route.start_address,
            'end_lat': float(route.end_latitude),
            'end_lng': float(route.end_longitude),
            'end_address': route.end_address
        })
    
    user_route = {
        'user_id': current_user,
        'start_lat': route_data.start_location.lat,
        'start_lng': route_data.start_location.lng,
        'end_lat': route_data.end_location.lat,
        'end_lng': route_data.end_location.lng
    }
    
    matches = MLService.find_route_matches(user_route, all_routes)
    return {"matches": matches}


@router.post("/routes/create", status_code=201)
def create_route(
    route_data: RouteCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save user's travel route"""
    typical_time = datetime.strptime(route_data.typical_time, "%H:%M").time()
    
    route = TravelRoute(
        user_id=current_user,
        route_name=route_data.route_name,
        start_address=route_data.start_address,
        start_latitude=route_data.start_location.lat,
        start_longitude=route_data.start_location.lng,
        end_address=route_data.end_address,
        end_latitude=route_data.end_location.lat,
        end_longitude=route_data.end_location.lng,
        typical_time=typical_time
    )
    
    db.add(route)
    db.commit()
    db.refresh(route)
    
    return {"id": route.id, "message": "Route saved successfully"}


@router.get("/routes/my")
def get_my_routes(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved routes"""
    routes = db.query(TravelRoute).filter(
        TravelRoute.user_id == current_user,
        TravelRoute.is_active == True
    ).all()
    
    result = []
    for route in routes:
        result.append({
            "id": route.id,
            "route_name": route.route_name,
            "start_address": route.start_address,
            "start_latitude": float(route.start_latitude),
            "start_longitude": float(route.start_longitude),
            "end_address": route.end_address,
            "end_latitude": float(route.end_latitude),
            "end_longitude": float(route.end_longitude),
            "typical_time": str(route.typical_time) if route.typical_time else None
        })
    
    return {"routes": result}