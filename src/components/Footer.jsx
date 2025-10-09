import { MapPin, Mail, Phone, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <div className="footer-brand">
              <MapPin className="footer-brand-icon" />
              <span className="footer-brand-text">PathGuardian</span>
            </div>
            <p className="footer-description">
              Empowering safer journeys with smart route planning and real-time safety insights.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/report">Report</Link></li>
              <li><Link to="/sos">Emergency SOS</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-contacts">
              <li>
                <Mail size={16} />
                <span>support@pathguardian.com</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+91 1800-123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} PathGuardian. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <Heart size={14} className="heart-icon" /> for safer communities
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
