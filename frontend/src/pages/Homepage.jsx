import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet/dist/leaflet.css';
import CurrentLocationPopup from '../components/CurrentLocationPopup';
import SunPopup from '../components/SunPopup';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

export default function HomePage() {
    const [sessionId] = useState(() => {
        let id = localStorage.getItem('sessionId');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('sessionId', id);
        }
        return id;
    });

    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setCurrentPosition([51.505, -0.09]);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setCurrentPosition([coords.latitude, coords.longitude]),
            () => setCurrentPosition([51.505, -0.09])
        );
    }, []);

    if (!currentPosition) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading your location…</p>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-4xl mb-4">
                    <span className="font-serif text-gray-800">Welcome to </span>
                    <span className="font-sans font-bold text-sunrise-600">SolarGem</span>
                </h1>
                <p className="font-serif text-gray-700 text-lg max-w-4xl mx-auto">
                    SolarGem lets you explore local and global sunrise & sunset times. Simply click on the map—or use your current location—to see today’s times and discover other cities with matching daylight patterns suggested by Google Gemini. All your searches are saved in History for reference.
                </p>
            </div>
            <div className="w-full max-w-9xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden">
                <MapContainer
                    center={currentPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    />

                    <Marker position={currentPosition} />

                    <CurrentLocationPopup
                        lat={currentPosition[0]}
                        lon={currentPosition[1]}
                        sessionId={sessionId}
                    />

                    <SunPopup sessionId={sessionId} />
                </MapContainer>
            </div>
        </main>
    );
}
