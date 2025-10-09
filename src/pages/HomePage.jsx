import { Shield, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Shield size={64} />
          </div>
          <h1 className="hero-title">PathGuardian</h1>
          <p className="hero-subtitle">Smart Safety Map</p>
          <p className="hero-tagline">Find the safest path, not just the fastest.</p>

          <button className="hero-button" onClick={() => navigate('/map')}>
            <MapPin size={20} />
            <span>Start Exploring</span>
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon green">
              <MapPin size={32} />
            </div>
            <h3>Smart Routes</h3>
            <p>View multiple route options with real-time safety scores</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <AlertCircle size={32} />
            </div>
            <h3>Safety Reports</h3>
            <p>Report unsafe areas and help the community stay informed</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red">
              <Shield size={32} />
            </div>
            <h3>Emergency SOS</h3>
            <p>Quick access to emergency alerts when you need help</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
