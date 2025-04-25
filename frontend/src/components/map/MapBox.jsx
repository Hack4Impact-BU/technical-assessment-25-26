import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from 'leaflet';
import './MapBox.css';
import 'leaflet/dist/leaflet.css';
import Sun from "../../components/sun/sun.jsx";
import Chat from "../../components/chat/chat.jsx";
import { useState, useEffect } from 'react';

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

function MapBox({position, setPosition}) {
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
            <ChangeView center={position} />
            <TileLayer
            attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=NrBr0ysd267nrNXn7KQ85PJrWXvQQaKhvBTj4G6h5NReZHvyZzo55pgXZUOEokRl"
            />
            <Marker position={position} icon={customIcon}>
            <Popup>
                <Sun position={position} setPosition={setPosition}/>
                <Chat position={position}/>
            </Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapBox;


