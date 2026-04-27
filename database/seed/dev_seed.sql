-- Development Seed Data

-- Sample Users
INSERT INTO users (id, email, password_hash, name, phone, user_type) VALUES
('usr_host1', 'jane@example.com', '$2b$12$bK0kCCYd0WlN8h3iH0ITm.vdMQ75f2dfu5u2b5r3fG6h6BW8x0Mqi', 'Jane Smith', '+1234567890', 'host'),
('usr_guest1', 'john@example.com', '$2b$12$bK0kCCYd0WlN8h3iH0ITm.vdMQ75f2dfu5u2b5r3fG6h6BW8x0Mqi', 'John Doe', '+0987654321', 'traveler'),
('usr_guest2', 'alice@example.com', '$2b$12$bK0kCCYd0WlN8h3iH0ITm.vdMQ75f2dfu5u2b5r3fG6h6BW8x0Mqi', 'Alice Johnson', '+1122334455', 'traveler');

-- Sample Rooms
INSERT INTO rooms (id, host_id, title, description, price, price_type, max_hours, address, latitude, longitude, amenities, images) VALUES
('rm_001', 'usr_host1', 'Downtown Studio', 'Private studio with workspace and attached washroom for short productive stays.', 350.00, 'hourly', 8, 'Connaught Place, New Delhi', 28.6315, 77.2167, '["wifi","ac","workspace"]'::jsonb, '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900"]'::jsonb),
('rm_002', 'usr_host1', 'Quiet Garden Room', 'Peaceful room with natural light near metro access, ideal for commuters.', 280.00, 'hourly', 6, 'Karol Bagh, New Delhi', 28.6519, 77.1909, '["wifi","ac","tea"]'::jsonb, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900"]'::jsonb),
('rm_003', 'usr_host1', 'Workday Rest Pod', 'Compact clean room with desk and charging points for 4-8 hour rest or work.', 220.00, 'hourly', 5, 'Rajouri Garden, New Delhi', 28.6427, 77.1228, '["wifi","desk","charging"]'::jsonb, '["https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=900"]'::jsonb);

-- Sample Routes
INSERT INTO travel_routes (id, user_id, route_name, start_address, start_latitude, start_longitude, end_address, end_latitude, end_longitude, typical_time) VALUES
('rt_001', 'usr_guest1', 'Noida to Gurgaon', 'Sector 62, Noida', 28.6270, 77.3720, 'Cyber City, Gurgaon', 28.4954, 77.0890, '09:00'),
('rt_002', 'usr_guest2', 'Gurgaon to Noida', 'DLF Phase 3, Gurgaon', 28.4930, 77.0930, 'Sector 18, Noida', 28.5708, 77.3272, '18:30');

-- Sample Saved Rooms
INSERT INTO saved_rooms (id, user_id, room_id) VALUES
('sav_001', 'usr_guest1', 'rm_001'),
('sav_002', 'usr_guest1', 'rm_003'),
('sav_003', 'usr_guest2', 'rm_002');

-- Sample Activity Feed
INSERT INTO user_activities (id, user_id, event_type, message, metadata) VALUES
('act_001', 'usr_guest1', 'booking_create', 'Booked Downtown Studio for focused work', '{"room_id":"rm_001"}'::jsonb),
('act_002', 'usr_guest1', 'room_saved', 'Saved Workday Rest Pod', '{"room_id":"rm_003"}'::jsonb),
('act_003', 'usr_guest2', 'route_create', 'Created Gurgaon to Noida commute route', '{"route_id":"rt_002"}'::jsonb);