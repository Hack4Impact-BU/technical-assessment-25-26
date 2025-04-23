import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';

const customIcon = L.icon({
    iconUrl: '../../../public/close.png', // This image must have no background
    iconSize: [40, 40],
    popupAnchor: [0,0]
});

const Map = () => {
    const LocationMarker = () => {
        const [position, setPosition] = useState(null)

        
        const map = useMapEvents({
            click() {
                map.locate()
            },
            locationfound(e) {
                setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
            },
        })

        return position === null ? null : (
        <Marker position={position} icon={customIcon}>
            <Popup id="map_popup">
                <h3>Hi Mom</h3>
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
            </MapContainer>,
        </>
    );
}

export default Map;