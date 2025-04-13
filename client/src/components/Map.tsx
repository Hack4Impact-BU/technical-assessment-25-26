import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";

export default function MapView() {
    return (
        <div className = "h-[calc(100vh-64px)] w-full overflow-hidden">
            <MapContainer
                center={[0, 0]}
                zoom={2}
                minZoom={2}
                scrollWheelZoom={true}
                worldCopyJump={true}
                className="h-full w-full"
                maxBounds={[[-85, -Infinity], [85, Infinity]]}
                maxBoundsViscosity={1.0}
            >
            <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            </MapContainer>
        </div>
    );
  }