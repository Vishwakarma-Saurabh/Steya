from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import activity, auth, bookings, dashboard, matches, rooms
from app.database import Base, engine
from app.models import *  # noqa: F401,F403

Base.metadata.create_all(bind=engine)


def _run_safe_startup_migrations():
    # Keep local/dev DB compatible when schema evolved between runs.
    statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
        "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
        "ALTER TABLE travel_routes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
        """
        CREATE TABLE IF NOT EXISTS user_activities (
            id VARCHAR(50) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            event_type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS saved_rooms (
            id VARCHAR(50) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """,
        "CREATE UNIQUE INDEX IF NOT EXISTS uq_saved_room_user_room ON saved_rooms (user_id, room_id)",
    ]
    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))


_run_safe_startup_migrations()

app = FastAPI(title="Steya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["rooms"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(activity.router, prefix="/api/activity", tags=["activity"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/")
def root():
    return {"message": "Steya API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}