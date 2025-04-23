import Navbar from './components/navbar/navbar';
import Welcome from './components/welcome/welcome';
import MapBox from './components/map/MapBox';
import Sun from './components/sun/sun.jsx';
import 'leaflet/dist/leaflet.css';

import './App.css';



function App() {
    return (
        <>
            <Navbar/>
            <Welcome/>
            <MapBox/>
        </>
    )
}

export default App;