import Navbar from './components/navbar/navbar';
import Welcome from './components/welcome/welcome';
import MapBox from './map/MapBox';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

import './App.css';



function App() {
    return (
        <>
            <Navbar/>
            <Welcome/>
            <MapBox/>

            <a id="markerAttribution" href="https://www.flaticon.com/free-icons/location" title="location icons">Location icons created by adrianadam - Flaticon</a>
        </>
    )
}

export default App;