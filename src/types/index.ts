export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export interface GPSError {
  code: number;
  message: string;
}
