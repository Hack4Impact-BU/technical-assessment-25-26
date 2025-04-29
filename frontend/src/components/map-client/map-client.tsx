import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import APIData from "../api-data/api-data";

import L from "leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function MapClient() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [onClick, setOnClick] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
      },
      (err) => {
        console.error("Location error:", err);
        setError("Unable to retrieve your location");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="w-full max-w-[1200px] max-h-[75vh] aspect-[2/3] md:aspect-[3/1.8] shadow-lg rounded-3xl overflow-hidden border border-gray-200">
      {error && (
        <div className="w-full h-full flex items-center justify-center text-xl text-red-500">
          {error}
        </div>
      )}

      {!position && !error && (
        <div className="w-full h-full flex items-center justify-center text-xl text-gray-300">
          Requesting location…
        </div>
      )}

      {position && (
        <MapContainer
          center={position}
          zoom={6}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newPos = e.target.getLatLng();
                setPosition(newPos);
                setShowTip(false);
              },
              click: () => {
                setOnClick(true);
              }
            }}
          >
            { showTip && !onClick && (
                <Tooltip
                    direction="top"
                    offset={[0, -20]}
                    opacity={0.8}
                    permanent={true}
                >
                    Drag and click the pin anywhere to see sunrise & sunset
                </Tooltip>
            )}
            <Popup><APIData lat={position.lat} lng={position.lng}/></Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
