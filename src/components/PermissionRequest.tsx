import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, CheckCircle, X, Settings } from 'lucide-react';

interface PermissionRequestProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        const state = permission.state as 'granted' | 'denied' | 'prompt';
        if (state === 'prompt') {
          setPermissionStatus('unknown');
        } else {
          setPermissionStatus(state);
        }
        
        if (state === 'granted') {
          onPermissionGranted();
        }
      } catch (error) {
        console.log('Permission API not supported');
      }
    }
  };

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
      
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error: any) {
      console.error('Permission request failed:', error);
      setPermissionStatus('denied');
      onPermissionDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'denied':
        return <X className="w-8 h-8 text-red-500" />;
      default:
        return <MapPin className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Location permission granted! You can now use GPS tracking.';
      case 'denied':
        return 'Location permission denied. Please enable location access in your browser settings.';
      default:
        return 'GPS Tracker needs location permission to work properly.';
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (permissionStatus === 'granted') {
    return null; // Don't show if permission is already granted
  }

  return (
    <div className="permission-request bg-white rounded-lg shadow-lg p-6 mx-4 mb-6">
      <div className="text-center">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold mt-4 mb-2">Location Permission Required</h3>
        <p className={`text-sm mb-4 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        
        {permissionStatus === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-red-700 font-medium">How to enable location access:</p>
                <ul className="text-xs text-red-600 mt-2 space-y-1">
                  <li>• Click the location icon in your browser's address bar</li>
                  <li>• Select "Allow" for location access</li>
                  <li>• Or go to browser settings → Privacy → Location</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {permissionStatus !== 'denied' && (
            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className={`
                flex items-center justify-center px-6 py-3 rounded-lg font-semibold
                transition-all duration-200 transform active:scale-95
                ${isRequesting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              <MapPin className="w-5 h-5 mr-2" />
              {isRequesting ? 'Requesting Permission...' : 'Allow Location Access'}
            </button>
          )}
          
          <button
            onClick={checkPermissionStatus}
            className="flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
          >
            <Settings className="w-5 h-5 mr-2" />
            Check Permission Status
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Your location data stays on your device and is never shared.</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionRequest;
