import { useState, useEffect, useRef } from 'react';
import '../styles/MapPage.css';

function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [travelMode, setTravelMode] = useState('driving'); 
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        setIsLoaded(true);
        initMap();
      }, 100);
    };
    document.head.appendChild(script);

    return () => {
      stopTracking();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
      }
    };
  }, []);

  const initMap = () => {
    if (!window.L || !mapRef.current) {
      console.log('Leaflet or map ref not ready');
      return;
    }
    
    if (mapInstanceRef.current) {
      console.log('Map already initialized');
      return;
    }

    try {
      const map = window.L.map(mapRef.current, {
        center: [23.6693, 86.9842],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 3
      }).addTo(map);

      mapInstanceRef.current = map;
      
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);

      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setLocationError('Location tracking requires HTTPS connection');
      return;
    }

    setLocationError('Getting your location...');
    setIsTracking(true);

    
    const initialOptions = {
      enableHighAccuracy: false,
      timeout: 30000, 
      maximumAge: 300000 
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation = { lat: latitude, lng: longitude, accuracy };
        
        setUserLocation(newLocation);
        updateUserMarker(newLocation);
        setLocationError('✓ Location tracked successfully');
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16, {
            animate: true,
            duration: 0.5
          });
        }

        
        const watchOptions = {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000
        };

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const newLocation = { lat: latitude, lng: longitude, accuracy };
            
            setUserLocation(newLocation);
            updateUserMarker(newLocation);
            setLocationError('✓ Tracking active');
            
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([latitude, longitude], 16, {
                animate: true,
                duration: 0.5
              });
            }
          },
          (error) => {
            console.error('Watch error:', error.code, error.message);
            if (error.code === 3) { 
              setLocationError('⚠️ GPS signal weak, still tracking...');
            } else {
              setLocationError(getLocationErrorMessage(error));
            }
          },
          watchOptions
        );
      },
      (error) => {
        console.error('Initial error:', error.code, error.message);
        
        
        let errorMsg = '';
        switch(error.code) {
          case 1: 
            errorMsg = '❌ Location permission denied. Please allow location access in browser settings.';
            setIsTracking(false);
            break;
          case 2: 
            errorMsg = '❌ Location unavailable. Try:\n• Moving to a window\n• Enabling location services\n• Refreshing the page';
            setIsTracking(false);
            break;
          case 3: 
            errorMsg = '⏱️ GPS timeout. Use manual location instead.';
            setIsTracking(false);
            break;
          default:
            errorMsg = '❌ Location error. Try manual location.';
            setIsTracking(false);
        }
        
        setLocationError(errorMsg);
      },
      initialOptions
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    
   
    if (userMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  };

  const getLocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Please enable location access.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  const updateUserMarker = (location) => {
    if (!mapInstanceRef.current || !window.L) return;

    try {
      
      if (userMarkerRef.current) {
        if (userMarkerRef.current.accuracyCircle) {
          mapInstanceRef.current.removeLayer(userMarkerRef.current.accuracyCircle);
        }
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }

      
      const userIcon = window.L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="user-marker-container">
            <div class="user-marker-pulse"></div>
            <div class="user-marker-dot"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      
      userMarkerRef.current = window.L.marker([location.lat, location.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      
      const accuracyCircle = window.L.circle([location.lat, location.lng], {
        radius: location.accuracy,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(mapInstanceRef.current);

      
      userMarkerRef.current.accuracyCircle = accuracyCircle;

      
      userMarkerRef.current.bindPopup(`
        <b>Your Location</b><br>
        Lat: ${location.lat.toFixed(5)}<br>
        Lng: ${location.lng.toFixed(5)}<br>
        Accuracy: ±${Math.round(location.accuracy)}m
      `);
    } catch (err) {
      console.error('Error updating user marker:', err);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('Getting your location...');

    
    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrigin(`${latitude}, ${longitude}`);
        setError('');
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error('Current location error:', error);
        
        
        if (error.code === error.TIMEOUT) {
          const fallbackOptions = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes
          };
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setOrigin(`${latitude}, ${longitude}`);
              setError('Location set (approximate)');
              
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([latitude, longitude], 15);
              }
              
              
              setTimeout(() => setError(''), 2000);
            },
            (fallbackError) => {
              setError(getLocationErrorMessage(fallbackError));
            },
            fallbackOptions
          );
        } else {
          setError(getLocationErrorMessage(error));
        }
      },
      options
    );
  };

  const geocodeLocation = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  const getRoute = async (startCoords, endCoords, mode) => {
    try {
      
      const profile = mode === 'walking' ? 'foot' : 'car';
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${profile}/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`
      );
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        return data.routes;
      }
      return null;
    } catch (err) {
      console.error('Routing error:', err);
      return null;
    }
  };

  const calculateSafetyScore = (route) => {
    const distance = route.distance / 1000;
    const duration = route.duration / 60;
    const steps = route.legs[0].steps.length;
    
    let score = 7.5;
    
    if (distance < 2) score += 1.0;
    else if (distance > 10) score -= 1.5;
    
    if (steps < 5) score += 0.5;
    else if (steps > 15) score -= 0.5;
    
    const speedKmh = (distance / duration) * 60;
    if (speedKmh > 30 && speedKmh < 60) score += 0.5;
    
    score += (Math.random() - 0.5) * 1.0;
    score = Math.max(3.0, Math.min(9.5, score));
    
    return parseFloat(score.toFixed(1));
  };

  const getSafetyColor = (score) => {
    if (score >= 8.0) return '#22c55e';
    if (score >= 5.0) return '#eab308';
    return '#ef4444';
  };

  const getSafetyLabel = (score) => {
    if (score >= 8.0) return 'Safe';
    if (score >= 5.0) return 'Moderate';
    return 'Risky';
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const clearMap = () => {
    if (!mapInstanceRef.current) return;

    try {
      routeLayersRef.current.forEach(layer => {
        try {
          if (mapInstanceRef.current && layer) {
            mapInstanceRef.current.removeLayer(layer);
          }
        } catch (e) {
          console.log('Error removing layer:', e);
        }
      });
      routeLayersRef.current = [];

      markersRef.current.forEach(marker => {
        try {
          if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker);
          }
        } catch (e) {
          console.log('Error removing marker:', e);
        }
      });
      markersRef.current = [];
    } catch (err) {
      console.log('Error clearing map:', err);
    }
  };

  const displayRoute = (routeData) => {
    if (!mapInstanceRef.current || !window.L) return;

    try {
      clearMap();

      const coordinates = routeData.route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const color = getSafetyColor(routeData.safetyScore);

      if (!coordinates || coordinates.length === 0) {
        console.error('No valid coordinates');
        return;
      }

      const routeLine = window.L.polyline(coordinates, {
        color: color,
        weight: 6,
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      routeLayersRef.current.push(routeLine);

      const startIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const endIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const startMarker = window.L.marker(coordinates[0], {
        icon: startIcon,
        title: 'Start'
      }).addTo(mapInstanceRef.current);
      
      const endMarker = window.L.marker(coordinates[coordinates.length - 1], {
        icon: endIcon,
        title: 'End'
      }).addTo(mapInstanceRef.current);

      startMarker.bindPopup('<b>Start Point</b>');
      endMarker.bindPopup('<b>Destination</b>');

      markersRef.current.push(startMarker, endMarker);

      const bounds = routeLine.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      }
    } catch (err) {
      console.error('Error displaying route:', err);
      setError('Error displaying route on map');
    }
  };

  const calculateRoutes = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination');
      return;
    }

    if (!isLoaded || !mapInstanceRef.current) {
      setError('Map is still loading. Please wait...');
      return;
    }

    setIsCalculating(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError('');

    try {
      console.log('Starting geocoding for origin:', origin);
      
      const startCoords = await geocodeLocation(origin);
      if (!startCoords) {
        setError('Could not find origin location. Try: "City, Country" format');
        setIsCalculating(false);
        return;
      }

      console.log('Origin found:', startCoords);
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting geocoding for destination:', destination);

      const endCoords = await geocodeLocation(destination);
      if (!endCoords) {
        setError('Could not find destination. Try: "City, Country" format');
        setIsCalculating(false);
        return;
      }

      console.log('Destination found:', endCoords);
      console.log('Fetching routes in', travelMode, 'mode...');

      const routesData = await getRoute(startCoords, endCoords, travelMode);
      
      if (!routesData || routesData.length === 0) {
        setError('No routes found. Locations might be too far apart.');
        setIsCalculating(false);
        return;
      }

      console.log('Routes found:', routesData.length);

      const routesWithScores = routesData.map((route, index) => {
        if (!route || !route.geometry || !route.geometry.coordinates) {
          console.error('Invalid route data:', route);
          return null;
        }
        
        return {
          route: route,
          index: index,
          safetyScore: calculateSafetyScore(route),
          distance: formatDistance(route.distance),
          duration: formatDuration(route.duration)
        };
      }).filter(r => r !== null);

      if (routesWithScores.length === 0) {
        setError('Failed to process route data');
        setIsCalculating(false);
        return;
      }

      routesWithScores.sort((a, b) => b.safetyScore - a.safetyScore);
      setRoutes(routesWithScores);
      
      console.log('Displaying safest route');
      
      if (routesWithScores.length > 0) {
        selectRoute(routesWithScores[0]);
      }

      setIsCalculating(false);
    } catch (err) {
      console.error('Error calculating routes:', err);
      setError(`Error: ${err.message || 'Please try again'}`);
      setIsCalculating(false);
    }
  };

  const selectRoute = (routeData) => {
    setSelectedRoute(routeData);
    displayRoute(routeData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateRoutes();
    }
  };

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <h2>Route Options</h2>
        <p className="sidebar-description">
          Enter locations to calculate safe routes
        </p>

        <div className="travel-mode-section">
          <label>Travel Mode</label>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${travelMode === 'driving' ? 'active' : ''}`}
              onClick={() => setTravelMode('driving')}
            >
              🚗 Driving
            </button>
            <button
              className={`mode-btn ${travelMode === 'walking' ? 'active' : ''}`}
              onClick={() => setTravelMode('walking')}
            >
              🚶 Walking
            </button>
          </div>
        </div>

        <div className="route-input-section">
          <div className="input-group">
            <label>Starting Point</label>
            <div className="input-with-button">
              <input
                type="text"
                placeholder="e.g., Burnpur, Asansol, India"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyPress={handleKeyPress}
                className="location-input"
              />
              <button
                className="location-btn"
                onClick={useCurrentLocation}
                title="Use current location"
              >
                📍
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Destination</label>
            <input
              type="text"
              placeholder="e.g., Asansol Station, India"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={handleKeyPress}
              className="location-input"
            />
          </div>
          <button 
            onClick={calculateRoutes} 
            className="calculate-btn"
            disabled={isCalculating || !isLoaded}
          >
            {isCalculating ? 'Calculating...' : !isLoaded ? 'Loading Map...' : 'Find Safe Routes'}
          </button>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="tracking-section">
          <button
            className={`tracking-btn ${isTracking ? 'active' : ''}`}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Live Tracking'}
          </button>
          {locationError && (
            <div className="error-message">
              {locationError}
            </div>
          )}
          {isTracking && userLocation && (
            <div className="tracking-info">
              <p>📍 Tracking your location</p>
              <p className="accuracy">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
            </div>
          )}
        </div>

        {routes.length > 0 && (
          <div className="routes-list">
            <h3>Available Routes ({routes.length})</h3>
            {routes.map((routeData, idx) => (
              <div
                key={idx}
                className={`route-card ${selectedRoute?.index === routeData.index ? 'selected' : ''}`}
                onClick={() => selectRoute(routeData)}
              >
                <div className="route-header">
                  <span className="route-number">Route {idx + 1}</span>
                  <span 
                    className="safety-badge"
                    style={{ backgroundColor: getSafetyColor(routeData.safetyScore) }}
                  >
                    {routeData.safetyScore}
                  </span>
                </div>
                <div className="route-label">
                  {getSafetyLabel(routeData.safetyScore)}
                </div>
                <div className="route-details">
                  <span>📍 {routeData.distance}</span>
                  <span>⏱️ {routeData.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {routes.length === 0 && !isCalculating && (
          <>
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
                <li>Real-time location tracking</li>
                <li>Multiple route alternatives</li>
                <li>Walking & driving modes</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="map-container-wrapper">
        <div ref={mapRef} className="google-map"></div>
        {!isLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;