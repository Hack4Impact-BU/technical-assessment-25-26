import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import LocationMarker from "../LocationMarker.tsx"

export default function Map() {
    return(
        <>
        <MapContainer  style={{height: '100%', width: '100%', bottom: '0' }} center={[42.350876,-71.106918]} zoom={13} scrollWheelZoom={false} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
        </>

    )
}

