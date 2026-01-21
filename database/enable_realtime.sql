-- Enable Realtime for chat_messages table
-- Run this in Supabase SQL Editor

-- First, check if realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Enable realtime for chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Verify it's enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages';

-- If you see the chat_messages table listed, realtime is enabled!

