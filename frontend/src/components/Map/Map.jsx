import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "../LocationMarker/LocationMarker";

const Map = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "80vh", width: "80vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
