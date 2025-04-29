import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { useState } from 'react';
import useGeolocation from '../../hooks/useGeolocation.jsx';

export default function Sun() {
    const { position, locationFound, error, isLoading } = useGeolocation();
    
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