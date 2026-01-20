import { useState, useEffect } from 'react';
import './RoomsPage.css';
import API_URL from '../config/api';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMembers, setRoomMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fetch room members
  const fetchRoomMembers = async (roomId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}/members`);
      const data = await response.json();
      if (data.success) {
        setRoomMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching room members:', error);
    } finally {
      setLoading(false);
    }
  };

  // View room details
  const viewRoomDetails = async (room) => {
    setSelectedRoom(room);
    await fetchRoomMembers(room.id);
  };

  // Delete room
  const handleDeleteRoom = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    if (!selectedRoom) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/admin/rooms/${selectedRoom.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Room "${selectedRoom.name}" deleted successfully! 🗑️`
        });
        setSelectedRoom(null);
        setRoomMembers([]);
        setShowDeleteConfirm(false);
        fetchRooms();
      } else {
        setMessage({
          type: 'error',
          text: `Failed to delete room: ${data.message || data.error || 'Unknown error'}`
        });
        console.error('Delete failed:', data);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error deleting room: ${error.message}`
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Download player list as TXT
  const downloadPlayerList = () => {
    if (!selectedRoom || roomMembers.length === 0) return;

    // Create text content
    let textContent = '';
    textContent += `========================================\n`;
    textContent += `${selectedRoom.name.toUpperCase()}\n`;
    textContent += `========================================\n`;
    textContent += `Total Players: ${roomMembers.length}\n`;
    textContent += `Capacity: ${selectedRoom.capacity}\n`;
    textContent += `Created: ${new Date(selectedRoom.created_at).toLocaleString()}\n`;
    textContent += `========================================\n\n`;

    textContent += `PLAYER LIST:\n`;
    textContent += `----------------------------------------\n\n`;

    roomMembers.forEach((member, index) => {
      textContent += `${index + 1}. ${member.user_name}\n`;
      textContent += `   WhatsApp: ${member.whatsapp_phone}\n`;
      textContent += `   Department: ${member.department}\n`;
      textContent += `   Added: ${new Date(member.added_at).toLocaleString()}\n`;
      textContent += `\n`;
    });

    textContent += `========================================\n`;
    textContent += `End of List\n`;
    textContent += `Downloaded: ${new Date().toLocaleString()}\n`;
    textContent += `========================================\n`;

    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedRoom.name}_Players_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessage({
      type: 'success',
      text: `Player list downloaded successfully! 📥`
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="rooms-page-container">
      <div className="rooms-page-header">
        <h1 className="rooms-page-title">All Rooms</h1>
        <p className="rooms-page-subtitle">View all rooms and their players</p>
      </div>

      {message.text && (
        <div className={`rooms-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="rooms-page-content">
        {/* Rooms List */}
        <div className="rooms-sidebar">
          <h2 className="sidebar-title">Rooms ({rooms.length})</h2>
          <div className="rooms-list">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                onClick={() => viewRoomDetails(room)}
              >
                <div className="room-item-header">
                  <h3 className="room-item-name">{room.name}</h3>
                  <span className="room-item-count">{room.member_count}</span>
                </div>
                <p className="room-item-description">{room.description}</p>
                <div className="room-item-footer">
                  <span className="room-item-date">
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                  <span className="room-item-capacity">
                    Capacity: {room.capacity}
                  </span>
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="empty-state">No rooms created yet</div>
            )}
          </div>
        </div>

        {/* Room Details */}
        <div className="room-details-panel">
          {selectedRoom ? (
            <>
              <div className="room-details-header">
                <div>
                  <h2 className="room-details-title">{selectedRoom.name}</h2>
                  <p className="room-details-subtitle">
                    {roomMembers.length} players in this room
                  </p>
                </div>
                <div className="room-details-actions">
                  <div className="room-details-info">
                    <div className="info-item">
                      <span className="info-label">Capacity:</span>
                      <span className="info-value">{selectedRoom.capacity}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">
                        {new Date(selectedRoom.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="room-action-buttons">
                    <button
                      className="download-list-btn"
                      onClick={downloadPlayerList}
                      disabled={loading || roomMembers.length === 0}
                    >
                      📥 Download List
                    </button>
                    <button
                      className="delete-room-btn"
                      onClick={handleDeleteRoom}
                      disabled={loading}
                    >
                      🗑️ Delete Room
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="loading-state">Loading players...</div>
              ) : (
                <div className="players-table-container">
                  <table className="players-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>WhatsApp Phone</th>
                        <th>Department</th>
                        <th>Added to Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomMembers.map((member, index) => (
                        <tr key={member.membership_id}>
                          <td>{index + 1}</td>
                          <td>{member.user_name}</td>
                          <td>{member.whatsapp_phone}</td>
                          <td>{member.department}</td>
                          <td>{new Date(member.added_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {roomMembers.length === 0 && (
                    <div className="empty-state">No players in this room yet</div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="no-room-selected">
              <div className="no-room-icon">🏠</div>
              <h3>Select a Room</h3>
              <p>Click on a room from the list to view its players</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2 className="modal-title">Delete Room?</h2>
            <p className="modal-subtitle">
              Are you sure you want to delete <strong>"{selectedRoom?.name}"</strong>?
            </p>
            <p className="modal-warning">
              This will permanently delete the room and remove all {roomMembers.length} players from it.
              This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                onClick={cancelDelete}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRoom}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

