-- Development Seed Data

-- Sample Users
INSERT INTO users (id, email, password_hash, name, phone, user_type) VALUES
('usr_host1', 'jane@example.com', '$2b$12$hash123', 'Jane Smith', '+1234567890', 'host'),
('usr_guest1', 'john@example.com', '$2b$12$hash456', 'John Doe', '+0987654321', 'traveler'),
('usr_guest2', 'alice@example.com', '$2b$12$hash789', 'Alice Johnson', '+1122334455', 'traveler');

-- Sample Rooms
INSERT INTO rooms (id, host_id, title, description, price, address, latitude, longitude, amenities) VALUES
('rm_001', 'usr_host1', 'Downtown Studio', 'Private studio with workspace', 35.00, '350 5th Ave, New York, NY', 40.7484, -73.9857, ARRAY['wifi', 'ac', 'workspace']),
('rm_002', 'usr_host1', 'Quiet Garden Room', 'Peaceful room with garden view', 20.00, '230 Park Ave, New York, NY', 40.7549, -73.9754, ARRAY['wifi', 'ac']),
('rm_003', 'usr_host1', 'Co-working Space', 'Room in shared co-working building', 15.00, '175 Greenwich St, New York, NY', 40.7118, -74.0125, ARRAY['wifi', 'coffee', 'printer']);

-- Sample Routes
INSERT INTO travel_routes (id, user_id, route_name, start_address, start_latitude, start_longitude, end_address, end_latitude, end_longitude, typical_time) VALUES
('rt_001', 'usr_guest1', 'Brooklyn to Midtown', 'Brooklyn Heights, NY', 40.6952, -73.9959, 'Midtown Manhattan, NY', 40.7549, -73.9840, '08:30'),
('rt_002', 'usr_guest2', 'Queens to Downtown', 'Long Island City, NY', 40.7471, -73.9417, 'Financial District, NY', 40.7074, -74.0113, '09:00');