import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapProps = {
  position: [number, number] | null;
};

const defaultCenter: [number, number] = [20, 0];

function SetViewToUser({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position, 6);
  return null;
}

export default function Map({ position }: MapProps) {
  const mapCenter = position ?? defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={position ? 6 : 2}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {position && <SetViewToUser position={position} />}
    </MapContainer>
  );
}