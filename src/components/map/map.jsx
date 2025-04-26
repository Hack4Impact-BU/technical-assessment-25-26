import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import getSolarEvents from './getSolarEvents';
import './map.css'; 

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

        const events = getSolarEvents(marker.lat, marker.lng);
        setSolarEvents(events);

        const fetchSimilarLocation = async () => {
            try {
                console.log('Sending request to backend with marker:', marker);

                const response = await fetch('http://localhost:4000/api/similar-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lat: marker.lat, lng: marker.lng }),
                });

                console.log('Backend response status (similar-location):', response.status);

                if (!response.ok) {
                    throw new Error('Failed to fetch similar location');
                }

                const data = await response.json();
                console.log('Backend response data (similar-location):', data);

                setSimilarLocation(data.similarLocation || 'No similar location found');

                // Save marker data to MongoDB
                const saveResponse = await fetch('http://localhost:4000/api/save-marker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lat: marker.lat,
                        lng: marker.lng,
                        geminiOutput: data.similarLocation,
                    }),
                });

                console.log('Save marker response status:', saveResponse.status);

                if (!saveResponse.ok) {
                    throw new Error('Failed to save marker');
                }

                console.log('Marker saved successfully');
            } catch (error) {
                console.error('Error fetching similar location or saving marker:', error);
            }
        };

        fetchSimilarLocation();
    }, [marker]);

    return (
        <MapContainer
            className="map-container"
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: 'calc(100vh - 90px)', width: '80%' }} // Adjust height to account for navbar
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