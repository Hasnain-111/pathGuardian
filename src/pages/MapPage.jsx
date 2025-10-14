import '../styles/MapPage.css';

function MapPage() {
  return (
    <div className="map-page">
      <div className="map-sidebar">
        <h2>Route Options</h2>
        <p className="sidebar-description">Safety scores will be displayed here once routes are calculated.</p>

        <div className="legend-box">
          <h3>Safety Legend</h3>
          <div className="legend-item">
            <div className="legend-color safe"></div>
            <div className="legend-details">
              <span className="legend-label">Safe (8.0+)</span>
              <p className="legend-desc">Well-lit areas with high foot traffic</p>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color moderate"></div>
            <div className="legend-details">
              <span className="legend-label">Moderate (5.0-7.9)</span>
              <p className="legend-desc">Average safety, use caution</p>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color risky"></div>
            <div className="legend-details">
              <span className="legend-label">Risky (&lt;5.0)</span>
              <p className="legend-desc">Low lighting, isolated areas</p>
            </div>
          </div>
        </div>

        <div className="map-info-box">
          <h3>Map Features</h3>
          <ul>
            <li>Interactive route visualization</li>
            <li>Real-time safety scoring</li>
            <li>Incident markers</li>
            <li>Alternative route suggestions</li>
          </ul>
        </div>
      </div>

      <div className="map-container-wrapper">
        <div className="map-placeholder">
          <div className="placeholder-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3>Map Integration Area</h3>
          <p>This space is reserved for the interactive map component</p>
          <div className="placeholder-note">
            Elhan Sir please : Integrate map here
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
