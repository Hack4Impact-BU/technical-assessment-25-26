import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const defaultCenter: [number, number] = [20, 0];
  const verticalBounds: [[number, number], [number, number]] = [[-85, -Infinity], [85, Infinity], ];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      maxBounds={verticalBounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}