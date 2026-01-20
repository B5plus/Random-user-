-- ============================================
-- FIX DELETE POLICY FOR ROOMS
-- ============================================
-- Run this in Supabase SQL Editor to fix delete permissions

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all operations on room_members" ON room_members;

-- Create new policies with explicit DELETE permission
CREATE POLICY "Enable all operations for rooms" ON rooms
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all operations for room_members" ON room_members
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('rooms', 'room_members');

