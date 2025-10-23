import { useState, useEffect } from 'react';
import { GPSService } from './services/gpsService';
import type { LocationData } from './types';
import LocationDisplay from './components/LocationDisplay';
import TrackingControls from './components/TrackingControls';
import LocationHistory from './components/LocationHistory';
import PermissionRequest from './components/PermissionRequest';
import { MapPin } from 'lucide-react';

function App() {
  const [gpsService] = useState(() => new GPSService());
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Load saved location history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('gps-location-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setLocationHistory(parsed);
      } catch (e) {
        console.error('Failed to load location history:', e);
      }
    }
  }, []);

  // Save location history to localStorage
  useEffect(() => {
    if (locationHistory.length > 0) {
      localStorage.setItem('gps-location-history', JSON.stringify(locationHistory));
    }
  }, [locationHistory]);

  const handleLocationUpdate = (location: LocationData) => {
    setCurrentLocation(location);
    setLocationHistory(prev => [...prev, location]);
    setError(null);
  };

  const handleGPSError = (error: any) => {
    console.error('GPS Error:', error);
    setError(error.message || 'GPS error occurred');
    setIsInitializing(false);
  };

  const handleGetCurrentLocation = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      const location = await gpsService.getCurrentPosition();
      setCurrentLocation(location);
      setLocationHistory(prev => [...prev, location]);
    } catch (error: any) {
      handleGPSError(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStartTracking = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      await gpsService.startTracking(handleLocationUpdate, handleGPSError);
      setIsTracking(true);
    } catch (error: any) {
      handleGPSError(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStopTracking = () => {
    gpsService.stopTracking();
    setIsTracking(false);
    setError(null);
  };

  const handleClearHistory = () => {
    setLocationHistory([]);
    localStorage.removeItem('gps-location-history');
  };

  const handlePermissionGranted = () => {
    setHasPermission(true);
    setError(null);
  };

  const handlePermissionDenied = () => {
    setHasPermission(false);
    setError('Location permission is required for GPS tracking to work.');
  };

  return (
    <div className="app min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">GPS Tracker</h1>
                <p className="text-sm text-gray-600">Real-time Location Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Permission Request */}
        {!hasPermission && (
          <PermissionRequest
            onPermissionGranted={handlePermissionGranted}
            onPermissionDenied={handlePermissionDenied}
          />
        )}

        {/* Tracking Controls */}
        <TrackingControls
          isTracking={isTracking}
          isInitializing={isInitializing}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          onGetCurrentLocation={handleGetCurrentLocation}
          error={error}
        />

        {/* Current Location Display */}
        <LocationDisplay
          location={currentLocation}
          isTracking={isTracking}
        />

        {/* Location History */}
        <LocationHistory
          locationHistory={locationHistory}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>GPS Tracker - Real-time Location Tracking</p>
            <p className="mt-1">Designed for mobile devices</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;