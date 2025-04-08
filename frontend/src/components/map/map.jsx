import "./map.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import "leaflet/dist/leaflet.css";

// Marker Icon
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function MapClickHandler({ setMarkers }) {
    /* 
        Listens and handles click events.
        Updates markers from the setMarkers state with sunrise and sunset data given from the Lat, Lng.
        Sends a POST request to backend API to retreive similar location data and also to store marker in history.
    */

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

                    fetch("http://localhost:3000/api/history/upload", {
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
    /* 
        Component: Map
        Displays the leaflets map with its handlers.
    */

    const [markers, setMarkers] = useState([]);

    return (
        <MapContainer center={[42.35, -71.09]} zoom={10} className="map-container">
            <TileLayer 
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap'
            /> 

            <MapClickHandler setMarkers={setMarkers} />
            {/*TODO: Clustering that will work with leaflets v4 */}
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
