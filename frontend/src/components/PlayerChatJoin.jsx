import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function PlayerChatJoin() {
  const navigate = useNavigate();
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/chat/rooms/${roomId}/verify-access`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ whatsapp_phone: whatsappPhone }),
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate(`/chat/${roomId}`, {
          state: { user: data.data, whatsappPhone },
        });
      } else {
        setError(data.message || "Access denied. You are not in this room.");
      }
    } catch (error) {
      console.error("Error verifying access:", error);
      setError("Failed to verify access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>JOIN CHAT ROOM</h1>
        <p style={styles.subtitle}>Enter your details to join the chat</p>

        <form onSubmit={handleJoin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>WhatsApp Phone Number</label>
            <input
              type="tel"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="+1234567890"
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "VERIFYING..." : "JOIN CHAT"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#2a2a2a",
    padding: "40px",
    borderRadius: "8px",
    border: "2px solid #8B1538",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#fff",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    padding: "12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #8B1538",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "16px",
  },
  button: {
    padding: "15px",
    backgroundColor: "#8B1538",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    backgroundColor: "#ff4444",
    color: "#fff",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "center",
  },
};

export default PlayerChatJoin;

