import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import LocationPopup from "./LocationPopup";

export default function MapView() {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [showCard, setShowCard] = useState(false);

  const defaultCenter: [number, number] = [20, 0];
  const verticalBounds: [[number, number], [number, number]] = [[-85, -Infinity], [85, Infinity], ];

  function MapClickHandler({onMapClick, onMapReset,}: {
    onMapClick: (latlng: [number, number]) => void;
    onMapReset: () => void;
  }) {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        onMapClick([lat, lng]);
        onMapReset();
      },
    });
    return null;
  }
  const customIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
      <MapClickHandler onMapClick={setMarkerPosition} onMapReset={() => setShowCard(false)}/>
      {markerPosition && (
        <>
          {(() => {
            const [lat, lng] = markerPosition;
            return (
              <Marker position={markerPosition} icon={customIcon}>
                <Popup>
                  {showCard ? (
                    <LocationPopup lat={lat} lng={lng} />
                  ) : (
                    <button onClick={(e) => {e.stopPropagation(); setShowCard(true);}} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md transition duration-150">
                      See the sun!
                    </button>
                  )}
                </Popup>
              </Marker>
            );
          })()}
        </>
      )}
    </MapContainer>
  );
}