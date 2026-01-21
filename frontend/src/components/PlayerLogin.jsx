import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "./PlayerLogin.css";

function PlayerLogin() {
  const navigate = useNavigate();
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Check if any rooms exist
      const roomsResponse = await fetch(`${API_URL}/api/admin/rooms`);
      const roomsData = await roomsResponse.json();

      if (!roomsData.success || roomsData.data.length === 0) {
        setError("No groups have been created yet. Please contact the admin.");
        setLoading(false);
        return;
      }

      // Step 2: Check if player exists and get their assigned rooms
      const playerResponse = await fetch(
        `${API_URL}/api/chat/player/rooms?whatsapp_phone=${encodeURIComponent(whatsappPhone)}`
      );
      const playerData = await playerResponse.json();

      if (!playerData.success) {
        setError("Failed to verify your account. Please try again.");
        setLoading(false);
        return;
      }

      if (playerData.data.length === 0) {
        setError(
          "You are not assigned to any group yet. Please contact the admin to add you to a group."
        );
        setLoading(false);
        return;
      }

      // Step 3: Navigate to room selection or directly to chat
      if (playerData.data.length === 1) {
        // Only one room - go directly to chat
        const room = playerData.data[0];
        navigate(`/player/chat/${room.room_id}`, {
          state: {
            user: {
              user_id: room.user_id,
              name: room.name,
              whatsapp_phone: whatsappPhone,
              room_name: room.room_name,
            },
            whatsappPhone,
          },
        });
      } else {
        // Multiple rooms - show selection page
        navigate("/player/select-room", {
          state: {
            rooms: playerData.data,
            whatsappPhone,
          },
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-login-container">
      <div className="player-login-card">
        <div className="login-header">
          <h1 className="login-title">PLAYER LOGIN</h1>
          <p className="login-subtitle">Enter your WhatsApp number to access your group chat</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">WhatsApp Phone Number</label>
            <input
              type="tel"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="+1234567890"
              className="login-input"
              required
            />
            <p className="input-hint">Enter the number you registered with</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "VERIFYING..." : "LOGIN"}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Not registered yet?{" "}
            <a href="/" className="footer-link">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlayerLogin;

