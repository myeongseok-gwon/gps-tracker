import type { LocationData, GPSError } from '../types';

// Re-export types for backward compatibility
export type { LocationData, GPSError };

export class GPSService {
  private watchId: number | null = null;
  private isTracking = false;
  private onLocationUpdate?: (location: LocationData) => void;
  private onError?: (error: GPSError) => void;

  constructor() {
    this.checkGeolocationSupport();
  }

  private checkGeolocationSupport(): boolean {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return false;
    }
    return true;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.checkGeolocationSupport()) {
      return false;
    }

    try {
      // Request permission by getting current position
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(),
          () => reject(new Error('Permission denied')),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public startTracking(
    onLocationUpdate: (location: LocationData) => void,
    onError?: (error: GPSError) => void
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.checkGeolocationSupport()) {
        reject(new Error('Geolocation not supported by this browser'));
        return;
      }

      if (this.isTracking) {
        reject(new Error('GPS tracking is already active'));
        return;
      }

      // Request permission first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        reject(new Error('Location permission denied. Please allow location access in your browser settings.'));
        return;
      }

      this.onLocationUpdate = onLocationUpdate;
      this.onError = onError;

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined
          };

          this.isTracking = true;
          this.onLocationUpdate?.(locationData);
        },
        (error) => {
          const gpsError: GPSError = {
            code: error.code,
            message: this.getErrorMessage(error.code)
          };
          this.onError?.(gpsError);
          reject(gpsError);
        },
        options
      );

      resolve();
    });
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied. Please allow location permissions in your browser settings.';
      case 2:
        return 'Location unavailable. Please check your GPS settings and try again.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while accessing location.';
    }
  }

  public stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  public getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!this.checkGeolocationSupport()) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined
          };
          resolve(locationData);
        },
        (error) => {
          const gpsError: GPSError = {
            code: error.code,
            message: error.message
          };
          reject(gpsError);
        },
        options
      );
    });
  }

  public isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  public getTrackingStatus(): string {
    if (!navigator.geolocation) {
      return 'unsupported';
    }
    if (this.isTracking) {
      return 'tracking';
    }
    return 'stopped';
  }
}
