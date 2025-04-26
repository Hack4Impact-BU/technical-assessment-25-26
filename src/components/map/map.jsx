import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import getSolarEvents from './getSolarEvents';

function AddMarkerOnDoubleClick({ setMarker }) {
    useMapEvent('dblclick', (e) => {
        setMarker(e.latlng);
    });
    return null;
}

function Map() {
    const [marker, setMarker] = useState(null);
    const [solarEvents, setSolarEvents] = useState({ sunrise: 'N/A', sunset: 'N/A' });
    const [similarLocation, setSimilarLocation] = useState('Loading...');

    useEffect(() => {
        if (!marker) return;

        // Fetch sunrise and sunset for the marker location
        const events = getSolarEvents(marker.lat, marker.lng);
        setSolarEvents(events);

        // Fetch similar location from the backend
        const fetchSimilarLocation = async () => {
            try {
                console.log('Sending request to backend with marker:', marker); // Log the marker data

                const response = await fetch('http://localhost:4000/api/similar-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lat: marker.lat, lng: marker.lng }),
                });

                console.log('Backend response status:', response.status); // Log the response status

                if (!response.ok) {
                    throw new Error('Failed to fetch similar location');
                }

                const data = await response.json();
                console.log('Backend response data:', data); // Log the response data

                setSimilarLocation(data.similarLocation || 'No similar location found');
            } catch (error) {
                console.error('Error fetching similar location:', error);
                setSimilarLocation('Error fetching similar location');
            }
        };

        fetchSimilarLocation();
    }, [marker]);

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%' }}
            doubleClickZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <AddMarkerOnDoubleClick setMarker={setMarker} />

            {marker && (
                <Marker position={marker}>
                    <Popup>
                        <div>Latitude: {marker.lat.toFixed(4)}</div>
                        <div>Longitude: {marker.lng.toFixed(4)}</div>
                        <div>Sunrise: {solarEvents.sunrise}</div>
                        <div>Sunset: {solarEvents.sunset}</div>
                        <div>Similar Location: {similarLocation}</div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default Map;