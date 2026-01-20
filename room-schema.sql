-- ============================================
-- ROOM SCHEMA FOR ADMIN DASHBOARD
-- ============================================
-- This schema creates tables for managing rooms and room members
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. ROOMS TABLE
-- ============================================
-- Stores information about each room created by admin

CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
CREATE POLICY "Allow all operations on rooms" ON rooms
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 2. ROOM_MEMBERS TABLE (Junction Table)
-- ============================================
-- Links users to rooms (many-to-many relationship)

CREATE TABLE IF NOT EXISTS room_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(room_id, user_id)  -- Prevents duplicate entries (same user in same room)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_added_at ON room_members(added_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
CREATE POLICY "Allow all operations on room_members" ON room_members
    FOR ALL
    USING (true)
    WITH CHECK (true);


-- ============================================
-- 3. VIEWS FOR EASY DATA RETRIEVAL
-- ============================================

-- View: Get room details with member count
CREATE OR REPLACE VIEW room_details AS
SELECT 
    r.id,
    r.name,
    r.description,
    r.capacity,
    r.created_at,
    r.updated_at,
    COUNT(rm.user_id) as member_count
FROM rooms r
LEFT JOIN room_members rm ON r.id = rm.room_id
GROUP BY r.id, r.name, r.description, r.capacity, r.created_at, r.updated_at
ORDER BY r.created_at DESC;

-- View: Get room members with user details
CREATE OR REPLACE VIEW room_members_details AS
SELECT 
    rm.id as membership_id,
    rm.room_id,
    rm.added_at,
    r.name as room_name,
    r.description as room_description,
    u.id as user_id,
    u.name as user_name,
    u.whatsapp_phone,
    u.department
FROM room_members rm
JOIN rooms r ON rm.room_id = r.id
JOIN users u ON rm.user_id = u.id
ORDER BY rm.added_at DESC;


-- ============================================
-- 4. SAMPLE QUERIES (For Testing)
-- ============================================

-- Get all rooms with member count
-- SELECT * FROM room_details;

-- Get all members of a specific room
-- SELECT * FROM room_members_details WHERE room_id = 'your-room-id-here';

-- Get total number of rooms
-- SELECT COUNT(*) as total_rooms FROM rooms;

-- Get room with most members
-- SELECT * FROM room_details ORDER BY member_count DESC LIMIT 1;

-- Get users not in any room
-- SELECT u.* FROM users u 
-- LEFT JOIN room_members rm ON u.id = rm.user_id 
-- WHERE rm.user_id IS NULL;

-- Delete a room (will automatically delete all room_members due to CASCADE)
-- DELETE FROM rooms WHERE id = 'your-room-id-here';


-- ============================================
-- 5. VERIFICATION
-- ============================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rooms', 'room_members');

-- Verify views were created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('room_details', 'room_members_details');

