import { MapPin, AlertCircle, FileText, Home, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <MapPin className="brand-icon" />
          <span className="brand-text">PathGuardian</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/map"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <MapPin size={18} />
              <span>Map</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/report"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>Report</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sos"
              className={({ isActive }) => `nav-link sos-link ${isActive ? 'active' : ''}`}
            >
              <AlertCircle size={18} />
              <span>SOS</span>
            </NavLink>
          </li>
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <User size={18} />
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
