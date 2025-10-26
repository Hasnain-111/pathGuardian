import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import MapPage from './pages/MapPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import SOSPage from './pages/SOSPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
// import {getDatabase} from 'firebase/database';
// import {app} from '../firebase.js';

// const db = getDatabase(app);

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleAuth = (userData) => {
    setUser(userData);

    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="app-wrapper">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} /> //yaha se change ho rha h
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
