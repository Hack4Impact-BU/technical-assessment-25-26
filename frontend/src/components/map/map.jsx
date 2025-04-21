import "./map.css";
import React, { useState, useContext } from 'react';
import { ThemeContext, TimeContext } from '../frame/contexts';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { formatTime } from '../global/time'
import { getSecureBrowserIdentity, API_URL } from '../global/signaturesClient';

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
            (async () => {
                const { lat, lng } = e.latlng;
                const sunrise = getSunrise(lat, lng);
                const sunset = getSunset(lat, lng);
                const markerId = Date.now();

                setMarkers(prev => [
                    ...prev,
                    {
                        id: markerId,
                        lat,
                        lng,
                        sunrise,
                        sunset,
                        geminiLocation: {
                            place: "...",
                            region: "...",
                            info: "..."
                        }
                    }
                ]);

                try {
                    const res = await fetch(`${API_URL}/api/suninfo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            lat,
                            lng,
                            sunrise,
                            sunset,
                            date: new Date().toLocaleDateString('en-US')
                        }),
                    });

                    const data = await res.json();

                    setMarkers(prev =>
                        prev.map(marker =>
                            marker.id === markerId
                                ? {
                                    ...marker,
                                    geminiLocation: {
                                        place: data.place,
                                        region: data.region,
                                        info: data.info
                                    }
                                }
                                : marker
                        )
                    );

                    const { browserId, signature } = await getSecureBrowserIdentity();

                    await fetch(`${API_URL}/api/history/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-browser-id": browserId,
                            "x-browser-signature": signature
                        },
                        body: JSON.stringify({
                            lat,
                            lng,
                            sunrise,
                            sunset,
                            geminiLocation: {
                                place: data.place,
                                region: data.region,
                                info: data.info
                            }
                        }),
                    });
                } catch (err) {
                    console.error("API error:", err);
                }
            })();
        },
    });

    return null;
}

export default function Map() {
    /* 
        Component: Map
        Displays the leaflets map with its handlers.
    */
    const STADIA_KEY = import.meta.env.VITE_STADIA_API_KEY;

    const [theme] = useContext(ThemeContext);
    const [markers, setMarkers] = useState([]);
    const [timeZone] = useContext(TimeContext);

    const lightTileUrl = `https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`;
    const darkTileUrl  = `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`;

    return (
        <MapContainer center={[42.35, -71.09]} zoom={10} className="map-container">
            <TileLayer
                url={theme ? darkTileUrl : lightTileUrl}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap'
            />
            <MapClickHandler setMarkers={setMarkers} />
            {markers.map((marker, idx) => (
                <Marker key={marker.id || idx} position={[marker.lat, marker.lng]} icon={defaultIcon}>
                    <Popup>
                        <strong>Location (Lat, Lng):</strong> {marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}<br />
                        <strong>Sunrise:</strong> {formatTime(marker.sunrise, timeZone)}<br />
                        <strong>Sunset:</strong> {formatTime(marker.sunset, timeZone)}<br />
                        <strong>Similar Place:</strong> {`${marker.geminiLocation.place}, ${marker.geminiLocation.region}` || "..."}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
