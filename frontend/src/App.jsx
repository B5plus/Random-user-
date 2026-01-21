import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import UserForm from './components/UserForm'
import AdminPage from './components/AdminPage'
import RoomsPage from './components/RoomsPage'
import AdminChatRoom from './components/AdminChatRoom'
import PlayerChatJoin from './components/PlayerChatJoin'
import PlayerChatRoom from './components/PlayerChatRoom'
import PlayerLogin from './components/PlayerLogin'
import PlayerRoomSelection from './components/PlayerRoomSelection'
import './App.css'

function Navigation() {
  const location = useLocation();

  // Don't show navigation on player pages, chat pages, or join chat page
  const hideNavPaths = ['/', '/join-chat', '/player/login', '/player/select-room'];
  const isChatPage = location.pathname.startsWith('/chat/') ||
                     location.pathname.startsWith('/admin/chat/') ||
                     location.pathname.startsWith('/player/chat/');

  if (hideNavPaths.includes(location.pathname) || isChatPage) {
    return null;
  }

  return (
    <nav className="app-nav">
      <Link to="/" className="nav-link">Player Registration</Link>
      <Link to="/admin" className="nav-link">Admin Dashboard</Link>
      <Link to="/rooms" className="nav-link">Rooms</Link>
      <Link to="/player/login" className="nav-link">Player Login</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />

        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/admin/chat/:roomId" element={<AdminChatRoom />} />
          <Route path="/join-chat" element={<PlayerChatJoin />} />
          <Route path="/chat/:roomId" element={<PlayerChatRoom />} />
          <Route path="/player/login" element={<PlayerLogin />} />
          <Route path="/player/select-room" element={<PlayerRoomSelection />} />
          <Route path="/player/chat/:roomId" element={<PlayerChatRoom />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
