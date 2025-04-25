import Navbar from './components/navbar/navbar';
import Welcome from './components/welcome/welcome';
import MapBox from './components/map/MapBox';
import Sun from './components/sun/sun.jsx';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

import './App.css';



function App() {
    const [position, setPosition] = useState([34.05223, -118.24368]);
    return (
        <>
            <Navbar/>
            <Welcome/>
            <MapBox position={position} setPosition={setPosition}/>
        </>
    )
}

export default App;