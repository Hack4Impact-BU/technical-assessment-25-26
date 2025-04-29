import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from 'leaflet';
import './MapBox.css';
import 'leaflet/dist/leaflet.css';
import Sun from "../../components/sun/sun.jsx";
import Chat from "../../components/chat/chat.jsx";
import { useState, useEffect } from 'react';
import useGeolocation from '../../hooks/useGeolocation.jsx';





function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

function MapBox() {
  const { position, locationFound, error, isLoading } = useGeolocation();



  

  const customIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=7880&format=png",
    iconSize: 38
  });

  if (!position || isNaN(position[0]) || isNaN(position[1])) {
    return <div>Loading map...</div>;
  }
    
  return (
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <ChangeView center={position} />
          <TileLayer
              attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=NrBr0ysd267nrNXn7KQ85PJrWXvQQaKhvBTj4G6h5NReZHvyZzo55pgXZUOEokRl"
          />
          <Marker position={position} icon={customIcon} eventHandlers={{
              click: () => {
                  console.log("Marker clicked at position:", position);
              },
          }}
          >
            <Popup>
                <Sun/>
                <Chat/>
            </Popup>
          </Marker>
      </MapContainer>
  );
}



export default MapBox;


