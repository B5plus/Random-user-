import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import API_URL from "../config/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function AdminChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchRoomDetails();
    fetchMessages();
    subscribeToMessages();

    return () => {
      supabase.channel("chat_messages").unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`);
      const data = await response.json();
      if (data.success) {
        setRoom(data.data);
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/rooms/${roomId}/messages`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/chat/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          sender_type: "admin",
          sender_name: "Admin",
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading chat...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/rooms")} style={styles.backButton}>
          ← Back to Rooms
        </button>
        <h2 style={styles.title}>Chat: {room?.name}</h2>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.sender_type === "admin" ? styles.adminMessage : styles.playerMessage),
            }}
          >
            <div style={styles.senderName}>{msg.sender_name}</div>
            <div style={styles.messageText}>{msg.message}</div>
            <div style={styles.timestamp}>
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#1a1a1a",
  },
  header: {
    padding: "20px",
    backgroundColor: "#2a2a2a",
    borderBottom: "2px solid #8B1538",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #8B1538",
    padding: "8px 16px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  title: {
    color: "#fff",
    margin: 0,
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    padding: "50px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
  message: {
    marginBottom: "15px",
    padding: "10px 15px",
    borderRadius: "8px",
    maxWidth: "70%",
  },
  adminMessage: {
    backgroundColor: "#8B1538",
    marginLeft: "auto",
    textAlign: "right",
  },
  playerMessage: {
    backgroundColor: "#2a2a2a",
    marginRight: "auto",
  },
  senderName: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#ccc",
  },
  messageText: {
    color: "#fff",
    marginBottom: "5px",
  },
  timestamp: {
    fontSize: "10px",
    color: "#999",
  },
  inputContainer: {
    display: "flex",
    padding: "20px",
    backgroundColor: "#2a2a2a",
    borderTop: "2px solid #8B1538",
  },
  input: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #8B1538",
    color: "#fff",
    borderRadius: "4px",
    marginRight: "10px",
  },
  sendButton: {
    padding: "12px 30px",
    backgroundColor: "#8B1538",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AdminChatRoom;

