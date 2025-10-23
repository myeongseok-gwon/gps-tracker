import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import type { LocationData } from '../types';
import { History, Trash2, Download, MapPin, Clock, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LocationHistoryProps {
  locationHistory: LocationData[];
  onClearHistory: () => void;
}

const LocationHistory: React.FC<LocationHistoryProps> = ({
  locationHistory,
  onClearHistory
}) => {
  const [showMap, setShowMap] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const duration = (endTime - startTime) / 1000; // Convert to seconds
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateDistance = (point1: LocationData, point2: LocationData) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const calculateTotalDistance = () => {
    if (locationHistory.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < locationHistory.length; i++) {
      totalDistance += calculateDistance(locationHistory[i-1], locationHistory[i]);
    }
    return totalDistance;
  };

  const getBounds = () => {
    if (locationHistory.length === 0) return null;
    
    const lats = locationHistory.map(loc => loc.latitude);
    const lngs = locationHistory.map(loc => loc.longitude);
    
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ] as [[number, number], [number, number]];
  };

  const exportHistory = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalPoints: locationHistory.length,
      totalDistance: calculateTotalDistance(),
      duration: locationHistory.length > 1 
        ? formatDuration(locationHistory[0].timestamp, locationHistory[locationHistory.length - 1].timestamp)
        : '0s',
      locations: locationHistory.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        timestamp: loc.timestamp,
        altitude: loc.altitude,
        speed: loc.speed,
        heading: loc.heading
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-track-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (locationHistory.length === 0) {
    return (
      <div className="location-history bg-white p-6 rounded-lg shadow-lg text-center">
        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Location History</h3>
        <p className="text-gray-500">Start tracking to build your location history</p>
      </div>
    );
  }

  const bounds = getBounds();
  const totalDistance = calculateTotalDistance();
  const startTime = locationHistory[0]?.timestamp;
  const endTime = locationHistory[locationHistory.length - 1]?.timestamp;

  return (
    <div className="location-history bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            Location History
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            <button
              onClick={exportHistory}
              className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
            <button
              onClick={onClearHistory}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="stat-item text-center">
            <div className="text-2xl font-bold text-blue-600">{locationHistory.length}</div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-2xl font-bold text-green-600">
              {(totalDistance / 1000).toFixed(2)}km
            </div>
            <div className="text-sm text-gray-600">Distance</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-2xl font-bold text-purple-600">
              {startTime && endTime ? formatDuration(startTime, endTime) : '0s'}
            </div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-2xl font-bold text-orange-600">
              {locationHistory.length > 1 
                ? (totalDistance / (locationHistory.length - 1)).toFixed(1) + 'm'
                : '0m'
              }
            </div>
            <div className="text-sm text-gray-600">Avg Distance</div>
          </div>
        </div>
      </div>

      {/* Map */}
      {showMap && bounds && (
        <div className="map-section">
          <MapContainer
            bounds={bounds}
            style={{ height: '300px', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Path Line */}
            {locationHistory.length > 1 && (
              <Polyline
                positions={locationHistory.map(loc => [loc.latitude, loc.longitude])}
                color="blue"
                weight={3}
                opacity={0.7}
              />
            )}
            
            {/* Start Marker */}
            {locationHistory.length > 0 && (
              <Marker position={[locationHistory[0].latitude, locationHistory[0].longitude]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">Start Point</p>
                    <p className="text-sm text-gray-600">
                      {formatTimestamp(locationHistory[0].timestamp)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* End Marker */}
            {locationHistory.length > 1 && (
              <Marker position={[locationHistory[locationHistory.length - 1].latitude, locationHistory[locationHistory.length - 1].longitude]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-red-600">End Point</p>
                    <p className="text-sm text-gray-600">
                      {formatTimestamp(locationHistory[locationHistory.length - 1].timestamp)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}

      {/* Location List */}
      <div className="location-list max-h-64 overflow-y-auto">
        {locationHistory.slice().reverse().map((location) => (
          <div key={location.timestamp} className="p-3 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                <div>
                  <p className="font-mono text-sm">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(location.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">±{location.accuracy.toFixed(1)}m</p>
                {location.speed && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <Navigation className="w-3 h-3 mr-1" />
                    {(location.speed * 3.6).toFixed(1)} km/h
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationHistory;
