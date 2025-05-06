import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import LocationPopup from "./LocationPopup";

export default function MapView(){
  const [markerPosition, setMarkerPosition] = useState<[number,number] | null>(null);
  const [showCard, setShowCard] =useState(false);

  const defaultCenter: [number,number] =[20, 0];
  const verticalBounds: [[number,number], [number,number]] = [[-85, -Infinity], [85, Infinity], ];

  function MapClickHandler({onMapClick,onMapReset,}:{onMapClick: (latlng: [number, number])=>void;onMapReset: () =>void;}) {
    useMapEvents({
      click(event){
        const { lat,lng } = event.latlng;
        onMapClick([lat, lng]);
        onMapReset();
      },
    });
    return null;
  }
  function ClickShield(){
    return (
      <div className="fixed inset-0 z-[998]"style={{ backgroundColor: "transparent",pointerEvents: "auto"}}onClick={(e)=> {e.preventDefault();e.stopPropagation();}}/>
    );
  }
  useEffect(() =>{
    const handleKeyDown= (e: KeyboardEvent)=> {
      if(e.key ==="Escape") {
        setShowCard(false);
      }
    };
    if(showCard){
      window.addEventListener("keydown", handleKeyDown);
    }
    return () =>{
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCard]);

  const customIcon = L.icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25,41],
    iconAnchor: [12, 41],
    popupAnchor: [1,-34],
  });
  function MapInteractionToggle({enabled }:{ enabled:boolean }) {
    const map= useMap();
    useEffect(() =>{
      if (enabled){
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
      } else {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
      }
    }, [enabled, map]);
  
    return null;
  }
  return (
    <>
      <MapContainer
        center={defaultCenter}
        zoom={2}
        minZoom={2}
        maxZoom={12}
        maxBounds={verticalBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={true}
        className="h-full w-full z-0"
      >
      <TileLayer attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <MapInteractionToggle enabled={showCard} />
      <MapClickHandler onMapClick={setMarkerPosition} onMapReset={() =>setShowCard(false)}/>
        {markerPosition &&(
          <Marker position={markerPosition} icon={customIcon}>
            <Popup>
              <button
                onClick={(e)=>{e.stopPropagation();setShowCard(true);}} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md transition duration-150">
                See the sun!
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {showCard && <ClickShield/>}
      {showCard && markerPosition && (
      <LocationPopup lat={markerPosition[0]}lng={markerPosition[1]}onClose={() => setShowCard(false)}/>
      )}
    </>
  );
  
}