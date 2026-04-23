# Staya Documentation

## 🎯 Project Overview

Steya enables users to:
- Find nearby rooms for short stays (4-8 hours or flexible)
- List unused rooms for rent
- Book affordable hyperlocal stays
- Get matched with users on opposite travel routes

## 🚀 Quick Start

# Clone repo
git clone <repo-url>
cd steya

# Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (React)
cd frontend
npm install
npm start

# ML Service
cd ml
pip install -r requirements.txt
python app.py

📋 Features (Hackathon Scope)
Feature	Status	Owner
User Registration/Login	✅ Core	Backend Team
List Room	✅ Core	Full Stack
Search Rooms by Location	✅ Core	Backend Team
Book Room (4-8 hrs)	✅ Core	Full Stack
Smart Route Matching	✅ Advanced	ML Team
Map View	✅ Core	Frontend Team

🏗️ Tech Stack
Frontend: React, TailwindCSS, MapLibre GL
Backend: FastAPI (Python), SQLAlchemy
Database: PostgreSQL with PostGIS
ML: Python, scikit-learn, Pandas

📚 Documentation Index
Document	Purpose
ARCHITECTURE.md	System design & data flow
API_REFERENCE.md	Complete API documentation
DATABASE_SCHEMA.md	Tables & relationships
ML_MATCHING.md	Matching algorithm explained
FRONTEND_GUIDE.md	React setup & components
BACKEND_GUIDE.md	FastAPI setup & endpoints
USER_FLOWS.md	Core user journeys

🔑 Environment Variables
env
# Backend (.env)
DATABASE_URL=postgresql://localhost:5432/staya
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256

# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAPBOX_TOKEN=your_token

# ML (.env)
ML_PORT=5000

🧪 Testing
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# ML tests
cd ml
pytest


=============================== Task Distribution =============================

Member 1: Authentication & User Management
Focus: User accounts, profiles, and core backend setup

Area	Tasks
Backend	Auth APIs (register/login), User profile APIs, JWT setup
Frontend	Login/Register pages, Profile page, Auth context
Database	Users table, initial database setup

Files Owned:
backend/app/api/v1/auth.py
backend/app/api/v1/users.py
backend/app/services/auth_service.py
backend/app/models/user.py
frontend/src/features/auth/*
frontend/src/features/profile/*


Member 2: Room Management & Search
Focus: Room listings, location search, and map integration

Area	Tasks
Backend	Room CRUD APIs, Location-based search, Filtering
Frontend	Search page, Room cards, Room detail page, Map component
Database	Rooms table

Files Owned:
backend/app/api/v1/rooms.py
backend/app/services/room_service.py
backend/app/models/room.py
frontend/src/features/rooms/*
frontend/src/shared/Map/*


Member 3: Booking System & Smart Matching (ML)
Focus: Booking management and intelligent matching features

Area	Tasks
Backend	Booking APIs, Matching APIs, ML algorithms (distance/matching)
Frontend	Booking form, Dashboard, My Bookings, Matches page, Route input
Database	Bookings table, Travel routes table

Files Owned:
backend/app/api/v1/bookings.py
backend/app/api/v1/matches.py
backend/app/services/booking_service.py
backend/app/services/ml_service.py
backend/app/models/booking.py
backend/app/models/route.py
frontend/src/features/bookings/*
frontend/src/features/matches/*


📁 Folder Structure

# Member 1 = InderDev
# Member 2 = Ashish
# Member 3 = Saurabh

steya/
│
├── frontend/
|   |__public/
|   |  |──index.html
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           👤 Member 1
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   └── ProfilePage.jsx
│   │   │   │   └── services/
│   │   │   │       └── authApi.js
│   │   │   │
│   │   │   ├── rooms/          👤 Member 2
│   │   │   │   ├── components/
│   │   │   │   │   ├── RoomCard.jsx
│   │   │   │   │   ├── RoomList.jsx
│   │   │   │   │   ├── RoomDetail.jsx
│   │   │   │   │   └── SearchPage.jsx
│   │   │   │   └── services/
│   │   │   │       └── roomApi.js
│   │   │   │
│   │   │   ├── bookings/       👤 Member 3
│   │   │   │   ├── components/
│   │   │   │   │   ├── BookingForm.jsx
│   │   │   │   │   ├── BookingCard.jsx
│   │   │   │   │   └── Dashboard.jsx
│   │   │   │   └── services/
│   │   │   │       └── bookingApi.js
│   │   │   │
│   │   │   └── matches/        👤 Member 3
│   │   │       ├── components/
│   │   │       │   ├── RouteForm.jsx
│   │   │       │   ├── MatchCard.jsx
│   │   │       │   └── MatchesPage.jsx
│   │   │       └── services/
│   │   │           └── matchApi.js
│   │   │
│   │   ├── shared/             👤 Shared (Member 2 leads)
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── Map/
│   │   │   │   └── SimpleMap.jsx
│   │   │   └── UI/
│   │   │       ├── Button.jsx
│   │   │       └── Input.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx    👤 Member 1
│   │   │
│   │   ├── services/
│   │   │   └── apiClient.js       👤 Member 1
│   │   │
│   │   ├── App.jsx
│   │   └── index.js
|   |   ├── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py        👤 Member 1
│   │   │       ├── users.py       👤 Member 1
│   │   │       ├── rooms.py       👤 Member 2
│   │   │       ├── bookings.py    👤 Member 3
│   │   │       └── matches.py     👤 Member 3
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py    👤 Member 1
│   │   │   ├── room_service.py    👤 Member 2
│   │   │   ├── booking_service.py 👤 Member 3
│   │   │   └── ml_service.py      👤 Member 3
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py            👤 Member 1
│   │   │   ├── room.py            👤 Member 2
│   │   │   ├── booking.py         👤 Member 3
│   │   │   └── route.py           👤 Member 3
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py            👤 Member 1
│   │   │   ├── room.py            👤 Member 2
│   │   │   └── booking.py         👤 Member 3
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── helpers.py         👤 Member 1
│   │   │
│   │   ├── __init__.py
│   │   ├── main.py                👤 Member 1 (setup)
│   │   ├── config.py              👤 Member 1 (setup)
│   │   └── database.py            👤 Member 1 (setup)
│   │
│   ├── requirements.txt
│   └── .env
│
├── database/                      👤 Member 1 leads
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_rooms.sql
│   │   ├── 003_create_bookings.sql
│   │   └── 004_create_routes.sql
│   ├── seeds/
│   │   └── dev_seed.sql
│   └── schema.sql
│
├── docs/                          👤 Everyone contributes
│   ├── README.md
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA.md
│   ├── FRONTEND_GUIDE.md
│   ├── BACKEND_GUIDE.md
│   └── ML_MATCHING.md
│
├── .gitignore
└── README.md

Member 1	Member 2	Member 3
Setup backend structure	Setup frontend structure	Understand ML requirements
Create User model	Create Room model	Create Booking & Route models
Auth APIs (register/login)	Room APIs (CRUD skeleton)	Booking APIs (create/get)
JWT implementation	Location search logic	ML distance function
Deliverables: All models created, basic APIs working, database setup complete

Member 1	Member 2	Member 3
Login/Register UI	Search page UI	Booking form UI
AuthContext setup	Room cards component	Dashboard layout
Profile page	Map integration	Route input form
Deliverables: Basic UI for all features, frontend-backend connection working

Member 1	Member 2	Member 3
Polish auth flow	Room detail page	Matching algorithm
Deliverables: Core features functional

Member 1	Member 2	Member 3
Help integrate auth	Advanced search filters	Matches page UI
User profile update	Location auto-detect	Match results display
Deliverables: Advanced features working

All Members
Integration: Connect all features together
Bug fixes and edge cases
UI polish and responsive design
Testing full user flows
Deliverables: Fully integrated application


🔄 Git Branch Strategy
main
  └── develop
       ├── feature/auth          👤 Member 1
       ├── feature/rooms         👤 Member 2
       └── feature/bookings-ml   👤 Member 3

🤝 Integration Points
Member 1 ↔ Member 2
Member 2 needs auth token for room creation

Member 1 provides get_current_user dependency

Member 1 ↔ Member 3
Member 3 needs auth for booking and matches

Member 1 provides auth context and protected routes

Member 2 ↔ Member 3
Member 3 needs room data for booking form

Member 2 provides room details API and components
