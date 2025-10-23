import React from 'react';
import { Play, Square, MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface TrackingControlsProps {
  isTracking: boolean;
  isInitializing: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onGetCurrentLocation: () => void;
  error: string | null;
}

const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  isInitializing,
  onStartTracking,
  onStopTracking,
  onGetCurrentLocation,
  error
}) => {
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (isInitializing) return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
    if (isTracking) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <MapPin className="w-5 h-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isInitializing) return 'Initializing...';
    if (isTracking) return 'Tracking Active';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isInitializing) return 'text-blue-600';
    if (isTracking) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="tracking-controls bg-white p-4 rounded-lg shadow-lg">
      {/* Status Display */}
      <div className="status-section mb-6">
        <div className="flex items-center justify-center mb-2">
          {getStatusIcon()}
          <span className={`ml-2 font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {error && (
          <div className="error-message bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="controls-section">
        <div className="grid grid-cols-1 gap-3">
          {/* Get Current Location Button */}
          <button
            onClick={onGetCurrentLocation}
            disabled={isInitializing}
            className={`
              flex items-center justify-center px-4 py-3 rounded-lg font-semibold
              transition-all duration-200 transform active:scale-95
              ${isInitializing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            <MapPin className="w-5 h-5 mr-2" />
            {isInitializing ? 'Getting Location...' : 'Get Current Location'}
          </button>

          {/* Start/Stop Tracking Button */}
          <button
            onClick={isTracking ? onStopTracking : onStartTracking}
            disabled={isInitializing}
            className={`
              flex items-center justify-center px-4 py-3 rounded-lg font-semibold
              transition-all duration-200 transform active:scale-95
              ${isInitializing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : isTracking
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isTracking ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Tracking
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions-section mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Allow location access when prompted</li>
          <li>• "Get Current Location" shows your position once</li>
          <li>• "Start Tracking" continuously updates your location</li>
          <li>• For best accuracy, use outdoors with clear sky view</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingControls;
