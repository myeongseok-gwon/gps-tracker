import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LocationData } from '../types';
import { MapPin, Navigation, Clock, Target } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LocationDisplayProps {
  location: LocationData | null;
  isTracking: boolean;
}

// Fix for default markers in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center when location changes
const MapUpdater: React.FC<{ location: LocationData | null }> = ({ location }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], map.getZoom());
    }
  }, [location, map]);
  
  return null;
};

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, isTracking }) => {
  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const abs = Math.abs(coord);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = ((abs - deg) * 60 - min) * 60;
    const direction = type === 'lat' 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    
    return `${deg}°${min}'${sec.toFixed(2)}"${direction}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return 'text-green-600';
    if (accuracy <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return 'Excellent';
    if (accuracy <= 20) return 'Good';
    if (accuracy <= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="location-display">
      {/* Map Section */}
      <div className="map-container">
        {location ? (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={18}
            style={{ height: '300px', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
              position={[location.latitude, location.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Current Location</p>
                  <p className="text-sm text-gray-600">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
            <MapUpdater location={location} />
          </MapContainer>
        ) : (
          <div className="map-placeholder">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-center">
              {isTracking ? 'Waiting for GPS signal...' : 'Start tracking to see your location'}
            </p>
          </div>
        )}
      </div>

      {/* Location Details */}
      {location && (
        <div className="location-details p-4 bg-white">
          <div className="grid grid-cols-1 gap-4">
            {/* Coordinates */}
            <div className="coordinate-section">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Coordinates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="coordinate-item">
                  <label className="text-sm text-gray-600">Latitude</label>
                  <p className="font-mono text-sm">{formatCoordinate(location.latitude, 'lat')}</p>
                  <p className="text-xs text-gray-500">{location.latitude.toFixed(8)}</p>
                </div>
                <div className="coordinate-item">
                  <label className="text-sm text-gray-600">Longitude</label>
                  <p className="font-mono text-sm">{formatCoordinate(location.longitude, 'lng')}</p>
                  <p className="text-xs text-gray-500">{location.longitude.toFixed(8)}</p>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="accuracy-section">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-green-600" />
                Accuracy
              </h3>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${getAccuracyColor(location.accuracy)}`}>
                  {getAccuracyText(location.accuracy)}
                </span>
                <span className="text-sm text-gray-600">
                  ±{location.accuracy.toFixed(1)}m
                </span>
              </div>
            </div>

            {/* Additional Data */}
            <div className="additional-data grid grid-cols-1 sm:grid-cols-2 gap-3">
              {location.altitude && (
                <div className="data-item">
                  <label className="text-sm text-gray-600">Altitude</label>
                  <p className="font-semibold">{location.altitude.toFixed(1)}m</p>
                </div>
              )}
              {location.speed && (
                <div className="data-item">
                  <label className="text-sm text-gray-600">Speed</label>
                  <p className="font-semibold">{(location.speed * 3.6).toFixed(1)} km/h</p>
                </div>
              )}
              {location.heading && (
                <div className="data-item">
                  <label className="text-sm text-gray-600">Heading</label>
                  <p className="font-semibold">{location.heading.toFixed(0)}°</p>
                </div>
              )}
              <div className="data-item">
                <label className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Last Update
                </label>
                <p className="font-semibold">{formatTimestamp(location.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
