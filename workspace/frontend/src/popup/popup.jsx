import 'leaflet/dist/leaflet.css'; // import what is used to customize the appearance of the map
import './popup.css'

import {Marker, Popup} from 'react-leaflet'

function CustomPopup({currentLocation, suntimes, jsonResponse}) {
 
    var blackIcon = new L.Icon({ // custom icon 
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

    return (
        <>   
        <Marker position={currentLocation} icon = {blackIcon}>
            <Popup className = "custom-popup"> {/* The br/ tag indicates break*. We want to display sunrise and sunset for relative location*/}
                <h1> Sunrise: {suntimes[0]} </h1>
                <h1> Sunset: {suntimes[1]} </h1>
                <br />
                <h2> {(jsonResponse.place || "Unknown")} <br /> </h2>
                {(jsonResponse.interesting_fact || "Unknown")}
            </Popup>
        </Marker>
        </>
    )
}

export default CustomPopup