import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import React, { useState, useEffect } from 'react'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import './map.css'

function Map() {
    const [position, setPosition] = useState([42.349998, -71.10315352])
    const [sunRises, setSunRises] = useState('')
    const [sunSets, setSunSets] = useState('')
    const [response, setResponse] = useState('')

    // Sends location data to the server for AI response
    async function postPosition() {
        try {
            const res = await fetch('http://dry-shelf-72596:4000/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ lat: position.lat, lng: position.lng, sunRise: sunRises, sunSet: sunSets }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const { result } = await res.json()
            setResponse(result || "failed response")
            console.log('Response from server:', result)
        } catch (e) {
            console.error('Error posting position:', e)
        }
    }

    useEffect(() => {
        if (!sunRises || !sunSets) return
        postPosition()
    }, [position.lat, position.lng, sunRises, sunSets])

    // Sets the position of the marker and gets sunrise/sunset times
    function SetLocation() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng)
                setSunRises(getSunrise(e.latlng.lat, e.latlng.lng).toLocaleTimeString())
                setSunSets(getSunset(e.latlng.lat, e.latlng.lng).toLocaleTimeString())
            },
        })
    }

    return (
        <MapContainer center={[42.349998, -71.10315352]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SetLocation />
            <Marker position={position}>
                <Popup>
                    Clicked here: {position.lat}, {position.lng} <br />
                    Sunrise: {sunRises} <br />
                    Sunset: {sunSets} <br /> <br />
                    {response}
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map