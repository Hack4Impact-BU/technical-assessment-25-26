import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { useState } from 'react';

export default function Sun({position, setPosition}) {
    const [locationFound, setLocationFound] = useState(false);
    if (navigator.geolocation && !{locationFound}) {
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
    const sunset =  getSunset(position[0], position[1]).toLocaleTimeString();
    const sunrise = getSunrise(position[0], position[1]).toLocaleTimeString();
    return (
        <div>
            <h2>Your Location:</h2>
           <p>Sunrise: {sunrise}</p>
           <p>Sunset: {sunset}</p>
        </div> 
    );
}