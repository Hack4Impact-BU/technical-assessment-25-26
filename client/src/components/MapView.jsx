import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
const dropIcon = new L.DivIcon({
    className: 'custom-icon-wrapper',
    html: `<div class="drop"><img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" /></div>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});


function LocationMarker({ onClick, sunData, similarLocation }) {
    const [position, setPosition] = useState(null)
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng

            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid latitude or longitude:", lat, lng);
                return; // Do not proceed if lat or lng is invalid
            }

            setPosition({ lat, lng })
            onClick(lat, lng) // call the handler from Home.jsx
        },
    })
    console.log("sun data inside:", typeof sunData)
    console.log("location inside:", typeof similarLocation)

    return position ? (
        <Marker position={[position.lat, position.lng]}>
            <Popup key={sunData ? sunData.sunrise : "no-data"}>
                You clicked here! <br />
                Lat: {position.lat.toFixed(2)}, Lng: {position.lng.toFixed(2)} <br />
                {sunData && sunData.sunrise && sunData.sunset && (
                    <>
                        <strong>Sunrise:</strong> {(sunData.sunrise).toLocaleString()} <br />
                        <strong>Sunset:</strong> {(sunData.sunset).toLocaleString()}
                    </>
                )}
                {similarLocation && (
                    <div style={{ marginTop: '8px' }}>
                        <strong> Similar Location:</strong> {similarLocation}
                    </div>
                )}
            </Popup>
        </Marker>
    ) : null
}

function MapView({ onMapClick, sunData, similarLocation }) {
    return (
        <MapContainer
            center={[42.3601, -71.0589]}
            zoom={3}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%', borderRadius: '16px' }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
            />
            <LocationMarker onClick={onMapClick} sunData={sunData} similarLocation={similarLocation} />
        </MapContainer>
    )
}

export default MapView