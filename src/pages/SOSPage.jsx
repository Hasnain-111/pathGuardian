import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import '../styles/SOSPage.css';

function SOSPage() {
  const [showModal, setShowModal] = useState(false);

  const handleSOSClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="sos-page">
      <div className="sos-container">
        <div className="sos-content">
          <h1>Emergency SOS</h1>
          <p className="sos-description">
            Press the button below in case of emergency. Your location will be shared with emergency contacts.
          </p>

          <button className="sos-button" onClick={handleSOSClick}>
            <AlertCircle size={64} className="sos-icon" />
            <span className="sos-text">SOS</span>
          </button>

          <div className="sos-info">
            <h3>When to use SOS:</h3>
            <ul>
              <li>You feel unsafe or threatened</li>
              <li>You witness a dangerous situation</li>
              <li>You need immediate assistance</li>
              <li>You're in an emergency situation</li>
            </ul>
          </div>

          <div className="emergency-contacts">
            <h3>Emergency Contacts:</h3>
            <div className="contact-list">
              <div className="contact-item">
                <strong>Emergency:</strong> 100
              </div>
              <div className="contact-item">
                <strong>Police:</strong> 100
              </div>
              <div className="contact-item">
                <strong>Fire:</strong> 102
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>

            <div className="modal-body">
              <div className="modal-icon">
                <AlertCircle size={64} />
              </div>
              <h2>SOS Alert Sent!</h2>
              <p>Your live location is being shared.</p>
              <p className="modal-subtext">
                Emergency services have been notified of your location.
                Help is on the way.
              </p>

              <button className="modal-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOSPage;
