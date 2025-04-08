import "./map.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import "leaflet/dist/leaflet.css";

// Marker Icon
const defaultIcon = new L.Icon({
    iconUrl: "https://cdn2.iconfinder.com/data/icons/places-4/100/sun_place_marker_location_vacation_sunny_relax-64.png",
    iconSize: [33, 38],
    iconAnchor: [12, 41],
    popupAnchor: [6, -34],
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
            const sunrise = getSunrise(lat, lng).toLocaleTimeString();
            const sunset = getSunset(lat, lng).toLocaleTimeString();
            fetch("http://localhost:3000/api/suninfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    lat, 
                    lng,
                    sunrise,
                    sunset,
                    date: (new Date()).toLocaleDateString('en-US')
                }),
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
                            sunrise,
                            sunset,
                            geminiLocation: data.geminiLocation,
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
                        <strong>Location (Lat, Lng):</strong> {marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}<br />
                        <strong>Sunrise:</strong> {marker.sunrise}<br />
                        <strong>Sunset:</strong> {marker.sunset}<br />
                        <strong>Similar Place:</strong> {marker.geminiMatch || "..."}
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
}
