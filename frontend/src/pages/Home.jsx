import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { getSunriseSunset } from '../api/sunriseAPI';
import { Typography, Box, Paper, Container } from '@mui/material';

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
      console.log('Data received from backend:', data);
      setTimes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sunrise/sunset times.');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("https://www.heropatterns.com/static/media/topography.145c5c95.svg")',
        backgroundColor: '#f5f5f5',
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        minHeight: '100vh',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Welcome to Sol Atlas
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Click anywhere on the map to discover sunrise, sunset, and a location with a similar sunrise/sunset time!
          </Typography>
        </Paper>

        <Box
          component={Paper}
          elevation={2}
          sx={{
            overflow: 'hidden',
            borderRadius: 2,
            height: '500px',
          }}
        >
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
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
                      {times.similarPlace && (
                        <div><strong>Similar Location:</strong> {times.similarPlace}</div>
                      )}
                    </div>
                  ) : (
                    <div>Loading...</div>
                  )}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      </Container>
    </Box>
  );
}