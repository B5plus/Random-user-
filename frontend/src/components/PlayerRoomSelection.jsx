import { useLocation, useNavigate } from "react-router-dom";
import "./PlayerRoomSelection.css";

function PlayerRoomSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, whatsappPhone } = location.state || {};

  if (!rooms || !whatsappPhone) {
    navigate("/player/login");
    return null;
  }

  const handleRoomSelect = (room) => {
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
  };

  return (
    <div className="room-selection-container">
      <div className="room-selection-card">
        <div className="selection-header">
          <h1 className="selection-title">SELECT YOUR GROUP</h1>
          <p className="selection-subtitle">
            You are a member of {rooms.length} group{rooms.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="room-card"
              onClick={() => handleRoomSelect(room)}
            >
              <div className="room-card-header">
                <h3 className="room-card-title">{room.room_name}</h3>
                <span className="room-card-badge">
                  {room.member_count} members
                </span>
              </div>
              {room.description && (
                <p className="room-card-description">{room.description}</p>
              )}
              <div className="room-card-footer">
                <span className="room-card-date">
                  Joined: {new Date(room.added_at).toLocaleDateString()}
                </span>
                <button className="room-card-button">
                  Open Chat →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="selection-footer">
          <button
            className="logout-button"
            onClick={() => navigate("/player/login")}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerRoomSelection;

