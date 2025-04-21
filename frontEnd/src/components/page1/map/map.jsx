import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import React from 'react'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import './map.css'

function Map() {
    const [position, setPosition] = React.useState([42.349998, -71.10315352])

    async function postPosition() {
        await fetch('http://localhost:4000/positions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat: position.lat, lng: position.lng }),
        })
    }

    function SetLocation() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng)
                postPosition()
            },
        })
    }

    return (
        <MapContainer center={[42.349998, -71.10315352]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    Clicked here: {position.lat}, {position.lng} <br />
                    Sunrise: {getSunrise(position.lat, position.lng).toLocaleTimeString()} <br />
                    Sunset: {getSunset(position.lat, position.lng).toLocaleTimeString()}
                </Popup>
            </Marker>
            <SetLocation />
        </MapContainer>
    )
}

export default Map