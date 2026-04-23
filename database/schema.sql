# -- Steya Database Schema
# -- PostgreSQL

# -- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS travel_routes CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# -- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) DEFAULT 'traveler',
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# -- Rooms Table
CREATE TABLE rooms (
    id VARCHAR(50) PRIMARY KEY,
    host_id VARCHAR(50) NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    price_type VARCHAR(20) DEFAULT 'hourly',
    max_hours INT DEFAULT 8,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# -- Bookings Table
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    room_id VARCHAR(50) NOT NULL REFERENCES rooms(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    special_requests TEXT,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# -- Travel Routes Table
CREATE TABLE travel_routes (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    route_name VARCHAR(100),
    start_address TEXT,
    start_latitude DECIMAL(10,8) NOT NULL,
    start_longitude DECIMAL(11,8) NOT NULL,
    end_address TEXT,
    end_latitude DECIMAL(10,8) NOT NULL,
    end_longitude DECIMAL(11,8) NOT NULL,
    typical_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# -- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_rooms_host ON rooms(host_id);
CREATE INDEX idx_rooms_active ON rooms(is_active);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_room ON bookings(room_id);
CREATE INDEX idx_routes_user ON travel_routes(user_id);