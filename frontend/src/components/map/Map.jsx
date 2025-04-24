import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';

const customIcon = L.icon({
    iconUrl: '../../../marker.png',
    iconSize: [40, 40],
    popupAnchor: [0,0]
});

const Map = () => {
    const LocationMarker = () => {
        const [position, setPosition] = useState(null);
        const [sunrise, setSunrise] = useState(null);
        const [sunset, setSunset] = useState(null);

        const map = useMapEvents({
            click() {
                map.locate();
            },
            locationfound(e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
                const sunrise = getSunrise(e.latlng.lat, e.latlng.lng, new Date());
                const sunset = getSunset(e.latlng.lat, e.latlng.lng, new Date());
                setSunrise(sunrise);
                setSunset(sunset);
                generateResponse(e.latlng, sunrise, sunset);
            },
        });

        const generateResponse = async (position, sunrise, sunset) => {
            const lat = position.lat;
            const long = position.lng;
            const rise = sunrise.toLocaleString('us-NY');
            const set = sunset.toLocaleString('us-NY');
            const request = `latitude: ${lat},
                            longitude: ${long}, 
                            sunrise: ${rise},
                            sunset: ${set},`
            console.log(request);
            try {
                const response = await fetch('http://localhost:5000/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ request })
                });

                if (!response.ok) {
                    throw new Error("Failed to generate response");
                }

                const data = await response.json();
                console.log("Generated response:", data.responseMessage);

            } catch (error) {
                console.error("Error generating response", error);
            }
        };


        return position === null ? null : (
            <Marker position={position} icon={customIcon}>
                <Popup id="map_popup">
                    <>
                        <h2>Ye Found Yer Booty!</h2>
                        <p>
                            <strong>Sunrise</strong> { sunrise ? sunrise.toLocaleString('us-NY') : '' }<br />
                            <strong>Sunset</strong> { sunset ? sunset.toLocaleString('us-NY') : '' }
                        </p>
                    </>
                </Popup>
            </Marker>
        )
    }

    return (
        <>
            <MapContainer
                center={{ lat: 42.355, lng: -71.056 }}
                zoom={13}
                scrollWheelZoom={true}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        </>
    );
}

export default Map;