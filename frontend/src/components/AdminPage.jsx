import { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMembers, setRoomMembers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/rooms');
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
    try {
      const response = await fetch(`http://localhost:3000/api/admin/rooms/${roomId}/members`);
      const data = await response.json();
      if (data.success) {
        setRoomMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching room members:', error);
    }
  };

  // View room details
  const viewRoomDetails = async (room) => {
    setSelectedRoom(room);
    await fetchRoomMembers(room.id);
  };

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  // Select random 50 users
  const selectRandom50 = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3000/api/admin/users/random/50');
      const data = await response.json();

      if (data.success) {
        setSelectedUsers(data.data);
        setMessage({
          type: 'success',
          text: `Selected ${data.selected} random users out of ${data.total_users} total users`
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to select random users'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please make sure the backend server is running.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add users to room directly (no modal)
  const addToRoom = async () => {
    if (selectedUsers.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select users first'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Generate automatic room name
      const roomNumber = rooms.length + 1;
      const roomName = `Room ${roomNumber}`;

      // Create room
      const roomResponse = await fetch('http://localhost:3000/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          description: `Auto-generated room with ${selectedUsers.length} selected users`,
          capacity: selectedUsers.length
        })
      });

      const roomData = await roomResponse.json();

      if (!roomData.success) {
        throw new Error('Failed to create room');
      }

      const roomId = roomData.data.id;

      // Add users to room
      const userIds = selectedUsers.map(user => user.id);
      const membersResponse = await fetch(`http://localhost:3000/api/admin/rooms/${roomId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds })
      });

      const membersData = await membersResponse.json();

      if (membersData.success) {
        setMessage({
          type: 'success',
          text: `${membersData.added_count} users added to ${roomName}! 🎉`
        });
        setSelectedUsers([]);
        fetchRooms();

        // Automatically open the newly created room
        viewRoomDetails(roomData.data);
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to add users to room'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error creating room. Please try again.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage Users & Rooms</p>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-controls">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Users:</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Selected:</span>
            <span className="stat-value">{selectedUsers.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Rooms:</span>
            <span className="stat-value">{rooms.length}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={selectRandom50}
            disabled={loading || users.length === 0}
            className="btn btn-primary"
          >
            {loading ? 'Selecting...' : 'Select Random 50 Users'}
          </button>
          <button
            onClick={addToRoom}
            disabled={loading || selectedUsers.length === 0}
            className="btn btn-success"
          >
            Add {selectedUsers.length} to Room
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="section">
          <h2 className="section-title">
            {selectedUsers.length > 0 ? 'Selected Users' : 'All Users'}
          </h2>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>WhatsApp Phone</th>
                  <th>Department</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {(selectedUsers.length > 0 ? selectedUsers : users).map((user, index) => (
                  <tr key={user.id} className={selectedUsers.includes(user) ? 'selected-row' : ''}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.whatsapp_phone}</td>
                    <td>{user.department}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="empty-state">No users registered yet</div>
            )}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Rooms</h2>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
                onClick={() => viewRoomDetails(room)}
              >
                <h3 className="room-name">{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <div className="room-stats">
                  <span>Members: {room.member_count}/{room.capacity}</span>
                  <span className="room-date">
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button className="view-room-btn">View Players</button>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="empty-state">No rooms created yet</div>
            )}
          </div>
        </div>

        {selectedRoom && (
          <div className="section">
            <div className="room-header">
              <div>
                <h2 className="section-title">{selectedRoom.name} - Players List</h2>
                <p className="room-subtitle">
                  {roomMembers.length} players in this room
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedRoom(null);
                  setRoomMembers([]);
                }}
              >
                Close
              </button>
            </div>
            <div className="users-table-container">
              <table className="users-table">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

