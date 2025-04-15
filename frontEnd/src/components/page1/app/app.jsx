import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './app.css'
import Button from '@mui/material/Button';
import React from 'react'

function App() {
    return (
    <>
        <h1>
            <span>TEST</span>
        </h1>
        <Button id='test' variant='text'>Hello World</Button>

        <div id="projects">
            <h2>Projects</h2>
        </div>

        <div id="exp">
            <h2>Experiences</h2>
        </div>
    </>
    )
}
export default App