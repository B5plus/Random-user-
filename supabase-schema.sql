-- Supabase Schema for User Form Data
-- This schema creates a table to store user information from the form

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    whatsapp_phone VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the created_at column for faster queries
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Create an index on the department column for filtering
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (you can customize this based on your needs)
-- For development: Allow all operations
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view to get user statistics by department
CREATE OR REPLACE VIEW users_by_department AS
SELECT
    department,
    COUNT(*) as user_count,
    MAX(created_at) as last_registration
FROM users
GROUP BY department
ORDER BY user_count DESC;

-- ============================================
-- ROOMS AND ROOM MEMBERS SCHEMA
-- ============================================

-- Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the room_members table (junction table for users and rooms)
CREATE TABLE IF NOT EXISTS room_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(room_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_added_at ON room_members(added_at DESC);

-- Enable Row Level Security (RLS) for rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations on rooms (for development)
CREATE POLICY "Allow all operations on rooms" ON rooms
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable Row Level Security (RLS) for room_members
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations on room_members (for development)
CREATE POLICY "Allow all operations on room_members" ON room_members
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a trigger to automatically update updated_at for rooms
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view to get room details with member count
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

-- Create a view to get room members with user details
CREATE OR REPLACE VIEW room_members_details AS
SELECT
    rm.id as membership_id,
    rm.room_id,
    rm.added_at,
    r.name as room_name,
    u.id as user_id,
    u.name as user_name,
    u.whatsapp_phone,
    u.department
FROM room_members rm
JOIN rooms r ON rm.room_id = r.id
JOIN users u ON rm.user_id = u.id
ORDER BY rm.added_at DESC;

