messgae
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('admin', 'player')),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read messages (we'll handle authorization in backend)
CREATE POLICY "Allow read access to chat messages" ON chat_messages
  FOR SELECT USING (true);

-- Create policy to allow insert (we'll handle authorization in backend)
CREATE POLICY "Allow insert chat messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Create policy to allow update (we'll handle authorization in backend)
CREATE POLICY "Allow update chat messages" ON chat_messages
  FOR UPDATE USING (true);

-- Create policy to allow delete (we'll handle authorization in backend)
CREATE POLICY "Allow delete chat messages" ON chat_messages
  FOR DELETE USING (true);

-- Enable Realtime for chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Create view for chat messages with room info
CREATE OR REPLACE VIEW chat_messages_with_room AS
SELECT 
  cm.id,
  cm.room_id,
  cm.sender_type,
  cm.sender_id,
  cm.sender_name,
  cm.message,
  cm.created_at,
  r.name as room_name
FROM chat_messages cm
JOIN rooms r ON cm.room_id = r.id
ORDER BY cm.created_at ASC;

