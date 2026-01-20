import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import UserForm from './components/UserForm'
import AdminPage from './components/AdminPage'
import RoomsPage from './components/RoomsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="app-nav">
          <Link to="/" className="nav-link">Player Registration</Link>
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
          <Link to="/rooms" className="nav-link">Rooms</Link>
        </nav>

        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
