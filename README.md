# GPS Tracker - Real-time Location Tracking

A modern, mobile-first GPS tracking application built with React and TypeScript. This application provides real-time location tracking with an intuitive mobile-optimized interface.

## Features

### 🎯 Real-time GPS Tracking
- **Live Location Updates**: Continuous GPS tracking with real-time position updates
- **High Accuracy**: Uses high-accuracy GPS settings for precise location data
- **Background Tracking**: Maintains tracking even when the app is in the background

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with touch-friendly controls
- **Progressive Web App**: Can be installed on mobile devices for native-like experience
- **Touch Gestures**: Smooth touch interactions and gestures

### 🗺️ Interactive Maps
- **OpenStreetMap Integration**: Uses Leaflet maps for reliable, offline-capable mapping
- **Real-time Markers**: Shows current location with accuracy indicators
- **Path Visualization**: Displays tracking history as a path on the map

### 📊 Location Analytics
- **Coordinate Display**: Shows latitude/longitude in multiple formats (decimal, DMS)
- **Accuracy Metrics**: Real-time accuracy indicators with color-coded status
- **Speed & Heading**: Displays movement speed and direction when available
- **Altitude Data**: Shows elevation information when GPS provides it

### 📈 History & Export
- **Location History**: Complete tracking history with timestamps
- **Statistics**: Total distance, duration, and average speed calculations
- **Export Functionality**: Export tracking data as JSON for analysis
- **Local Storage**: Automatically saves and restores tracking history

## Technology Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Leaflet** for interactive maps and geospatial features
- **Lucide React** for modern, consistent icons
- **CSS3** with mobile-first responsive design

## Getting Started

### Prerequisites
- Node.js 18+ 
- Modern web browser with GPS support
- HTTPS connection (required for GPS API)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gps-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Allow location permissions when prompted

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Tracking
1. **Get Current Location**: Tap "Get Current Location" to get your position once
2. **Start Tracking**: Tap "Start Tracking" for continuous location updates
3. **Stop Tracking**: Tap "Stop Tracking" to end the session

### Viewing Data
- **Map View**: Interactive map showing your current location and tracking path
- **Coordinates**: Detailed coordinate information in multiple formats
- **History**: Scroll through your complete tracking history
- **Statistics**: View total distance, duration, and other metrics

### Exporting Data
- **Export History**: Tap "Export" to download your tracking data as JSON
- **Clear Data**: Tap "Clear" to remove all stored location history

## Mobile Optimization

### Touch-Friendly Interface
- Large, easy-to-tap buttons
- Swipe gestures for navigation
- Optimized for one-handed use

### Performance
- Efficient GPS polling to preserve battery life
- Smooth animations and transitions
- Minimal data usage

### Accessibility
- High contrast mode support
- Screen reader compatibility
- Keyboard navigation support

## Browser Compatibility

### Supported Browsers
- **Chrome/Chromium** 60+
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+

### Required Features
- **Geolocation API**: For GPS functionality
- **Local Storage**: For data persistence
- **ES6+ Support**: For modern JavaScript features

## Security & Privacy

### Data Handling
- **Local Storage Only**: All data stays on your device
- **No Server Communication**: No location data is sent to external servers
- **User Control**: You can clear all data at any time

### Permissions
- **Location Access**: Required for GPS functionality
- **HTTPS Required**: Modern browsers require secure connections for GPS

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── LocationDisplay.tsx
│   ├── TrackingControls.tsx
│   └── LocationHistory.tsx
├── services/            # Business logic
│   └── gpsService.ts
├── App.tsx              # Main application
├── App.css              # Component styles
└── index.css            # Global styles
```

### Key Components

#### GPSService
- Handles all GPS-related functionality
- Manages location permissions and errors
- Provides real-time location updates

#### LocationDisplay
- Shows current location on interactive map
- Displays coordinate information
- Provides accuracy and speed data

#### TrackingControls
- Start/stop tracking controls
- Error handling and status display
- User-friendly interface

#### LocationHistory
- Displays tracking history
- Shows statistics and analytics
- Export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Check the browser console for error messages
- Ensure location permissions are granted
- Verify HTTPS connection for GPS functionality
- Test on different mobile devices and browsers

---

**Note**: This application requires GPS access and works best on mobile devices with clear sky visibility for optimal accuracy.