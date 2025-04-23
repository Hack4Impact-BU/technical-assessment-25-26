import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { useState } from 'react';

export default function Sun() {
    const [position, setPosition] = useState([42.361145, -71.057083]);
    const [locationFound, setLocationFound] = useState(false);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
            setLocationFound(true);
            },
            (err) => {
            console.error("Geolocation error:", err);
            setLocationFound(false);
            },
            {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
            }
        );
        }
    const sunset =  getSunset(position[0], position[1]).toString();
    const sunrise = getSunrise(position[0], position[1]).toString();
    return (
        <div>
           <a>Sunrise time: {sunrise} <br /> Sunset time: {sunset}</a> 
        </div> 
    );
}