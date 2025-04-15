import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './app.css'
import React from 'react'

function App() {
    return (
    <>
        <div id="projects">
            <h2>Projects</h2>
        </div>

        <MapContainer center={[51.505, -0.09,]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>

        <div id="exp">
            <h2>Experiences</h2>
        </div>
    </>
    )
}
export default App