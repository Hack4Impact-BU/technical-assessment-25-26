import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

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

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    console.log('Clicked at:', latlng); // for now just logs the location
  };

  return (
    <div>
      <h1>Welcome to Sol Atlas</h1>
      <p>Click anywhere on the map to discover sunrise and sunset times!</p>

      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ClickableMap onClick={handleMapClick} />
        {marker && (
          <Marker position={[marker.lat, marker.lng]}>
            <Popup>
              You clicked at:<br />Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}