import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import API_URL from "../config/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function PlayerChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, whatsappPhone } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/join-chat");
      return;
    }

    fetchMessages();
    subscribeToMessages();

    return () => {
      supabase.channel("chat_messages").unsubscribe();
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          sender_type: "player",
          sender_id: user.user_id,
          sender_name: user.name,
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
        <button
          onClick={() => navigate("/player/login")}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#8B1538";
            e.target.style.transform = "translateX(-5px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "translateX(0)";
          }}
        >
          ← Logout
        </button>
        <h2 style={styles.title}>{user?.room_name}</h2>
        <p style={styles.userName}>👤 {user?.name} • Player Chat Room</p>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.sender_type === "admin" ? styles.adminMessage : styles.playerMessage),
              ...(msg.sender_id === user.user_id ? styles.myMessage : {}),
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
          onFocus={(e) => {
            e.target.style.borderColor = "#8B1538";
            e.target.style.boxShadow = "0 0 0 3px rgba(139, 21, 56, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#333";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          style={styles.sendButton}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(139, 21, 56, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(139, 21, 56, 0.4)";
          }}
        >
          Send 📤
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
    backgroundColor: "#0f0f0f",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    padding: "20px 30px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderBottom: "3px solid #8B1538",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #8B1538",
    padding: "10px 20px",
    cursor: "pointer",
    marginBottom: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  title: {
    color: "#fff",
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "2px",
    background: "linear-gradient(135deg, #8B1538 0%, #ff1744 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  userName: {
    color: "#999",
    fontSize: "14px",
    margin: 0,
    fontWeight: "500",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "30px",
    background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)",
  },
  message: {
    marginBottom: "20px",
    padding: "15px 20px",
    borderRadius: "16px",
    maxWidth: "fit-content",
    minWidth: "150px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    animation: "slideIn 0.3s ease-out",
    display: "inline-block",
  },
  adminMessage: {
    background: "linear-gradient(135deg, #8B1538 0%, #6B0F2A 100%)",
    marginRight: "auto",
    borderBottomLeftRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  playerMessage: {
    background: "linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)",
    marginRight: "auto",
    borderBottomLeftRadius: "4px",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  myMessage: {
    background: "linear-gradient(135deg, #1e5a3e 0%, #164a2f 100%)",
    marginLeft: "auto",
    marginRight: 0,
    textAlign: "right",
    borderBottomRightRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  senderName: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#fff",
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  messageText: {
    color: "#fff",
    marginBottom: "8px",
    fontSize: "15px",
    lineHeight: "1.5",
    wordWrap: "break-word",
  },
  timestamp: {
    fontSize: "11px",
    color: "#ccc",
    opacity: 0.7,
    fontWeight: "500",
  },
  inputContainer: {
    display: "flex",
    padding: "25px 30px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderTop: "3px solid #8B1538",
    gap: "15px",
    boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5)",
  },
  input: {
    flex: 1,
    padding: "15px 20px",
    backgroundColor: "#0f0f0f",
    border: "2px solid #333",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s",
  },
  sendButton: {
    padding: "15px 35px",
    background: "linear-gradient(135deg, #8B1538 0%, #6B0F2A 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(139, 21, 56, 0.4)",
  },
};

export default PlayerChatRoom;

