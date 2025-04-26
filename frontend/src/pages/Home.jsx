import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { getSunriseSunset } from '../api/sunriseAPI';
import { Typography, Paper, Box } from '@mui/material';

function ClickableMap({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    }
  });
  return null;
}

export default function Home() {
  const [marker, setMarker] = useState(null);
  const [times, setTimes] = useState(null);
  const [error, setError] = useState(null);

  const handleMapClick = async (latlng) => {
    console.log('Frontend clicked at:', latlng);
    setMarker(latlng);
    setTimes(null);
    setError(null);

    try {
      const data = await getSunriseSunset(latlng.lat, latlng.lng);
      setTimes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sunrise/sunset times.');
    }
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}
        >
          Welcome to Sol Atlas
        </Typography>
        <Typography>
          Click anywhere on the map to discover sunrise, sunset, and a location with a similar sunrise/sunset time!
        </Typography>
      </Paper>

      <Paper elevation={2}>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClickableMap onClick={handleMapClick} />
          {marker && (
            <Marker position={[marker.lat, marker.lng]}>
              <Popup>
                {error && <div>{error}</div>}
                {times ? (
                  <div>
                    <div><strong>Sunrise:</strong> {new Date(times.sunrise).toLocaleTimeString()}</div>
                    <div><strong>Sunset:</strong> {new Date(times.sunset).toLocaleTimeString()}</div>
                    {times.similarLocation && (
                      <div><strong>Similar Location:</strong> {times.similarLocation}</div>
                    )}
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Paper>
    </Box>
  );
}
