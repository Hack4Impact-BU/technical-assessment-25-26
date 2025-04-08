import "./map.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSunrise, getSunset } from 'sunrise-sunset-js';

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function LocationMarker({ setMarkers }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const sunrise = getSunrise(lat, lng);
            const sunset = getSunset(lat, lng);
            fetch("http://localhost:3000/api/suninfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lat, lng }),
            })
                .then(res => res.json())
                .then(data => {
                    setMarkers(prev => [
                        ...prev,
                        {
                            lat,
                            lng,
                            sunrise,
                            sunset,
                            geminiMatch: data.geminiLocation,
                        },
                    ]);

                    fetch("http://localhost:3000/api/history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            lat,
                            lng,
                            timestamp: new Date().toISOString(),
                            geminiLocation: data.geminiLocation,
                            geminiRawResponse: data.geminiRawResponse,
                        }),
                    });
                });
        },
    });

    return null;
}

export default function Map() {
    const [markers, setMarkers] = useState([]);

    return (
        <MapContainer center={[40, -100]} zoom={4} className="map-container">
            <TileLayer 
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap'
            /> 

            <LocationMarker setMarkers={setMarkers} />
            {markers.map((marker, idx) => (
                <Marker key={idx} position={[marker.lat, marker.lng]} icon={defaultIcon}>
                    <Popup>
                        <strong>📍 Location:</strong> {marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}<br />
                        🌅 <strong>Sunrise:</strong> {marker.sunrise.toLocaleTimeString()}<br />
                        🌇 <strong>Sunset:</strong> {marker.sunset.toLocaleTimeString()}<br />
                        🌎 <strong>Gemini Match:</strong> {marker.geminiMatch || "Loading..."}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
