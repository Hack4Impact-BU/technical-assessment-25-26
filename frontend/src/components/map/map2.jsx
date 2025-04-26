import './map.css'
import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer} from "react-leaflet"

function Map2() {
    const map = L.map('map').setView([42.350876, -71.106918], 16);

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(`You clicked the map at ${e.latlng.toString()}`)
            .openOn(map);
    }

    map.on('click', onMapClick)
   


    return(
        <MapContainer center={[42.350876, -71.106918]} zoom={16}>
            <TileLayer
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <div id="map"></div>
        </MapContainer>
    )
}

export default Map2