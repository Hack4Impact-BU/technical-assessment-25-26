import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from 'leaflet'
import { useState } from 'react';
import './MapBox.css';
import 'leaflet/dist/leaflet.css';
import Sun from "../../components/sun/sun.jsx";



function MapBox() {
    const [position, setPosition] = useState([42.361145, -71.057083]);
    const [locationFound, setLocationFound] = useState(false);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
            setLocationFound(true);
          },
          (err) => {
            console.error("Geolocation error:", err);
            setLocationFound(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }


      

      const customIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=7880&format=png",
        iconSize: 38
      });

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customIcon}>
            <Popup>
                <Sun/>
            </Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapBox;



