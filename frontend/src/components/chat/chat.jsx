import { useState, useEffect } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import useGeolocation from '../../hooks/useGeolocation.jsx';
import './chat.css';

function Chat() {
    const { position, locationFound } = useGeolocation();
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState([0, 0]);
    const [location, setLocation] = useState([0, 0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    
    const [sunTimes, setSunTimes] = useState({
        sunrise: '',
        sunset: ''
    });
    console.log("called chat");
    async function getResponse() {
        if (!position) return;
        
        setIsLoading(true);
        setError(null);

        try {
            // 1. Fetch city name from your backend
            const response = await fetch('http://localhost:4000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ position })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch city name');
            }

            const { cityName: fetchedCityName } = await response.json();
            setCityName(fetchedCityName);
        
            console.log(fetchedCityName)

            
        
            // 2. Fetch coordinates from OpenStreetMap
            const osmResponse = await fetch(
                `http://localhost:4000/api/nominatim?q=${encodeURIComponent(fetchedCityName)}`,
                {
                  method: 'GET', // Explicitly state GET (optional but recommended)
                  headers: {
                    'User-Agent': 'Sundial/1.0 (ajh756.404@gmail.com)',
                    'Accept-Language': 'en-US,en;q=0.9'
                  }
                  // No body for GET requests!
                }
              );
            console.log(osmResponse);
            
            if (!osmResponse.ok) {
                throw new Error('Failed to fetch coordinates');
            }
            const osmData = await osmResponse.json();
            console.log('OSM Data:', osmData);
            
            
            
            if (osmData.length > 0) {
                const firstResult = osmData[0];
                setNewLocation([firstResult.lat, firstResult.lon]);
                console.log("newlocation:", newLocation)
                setLocation(newLocation);
                
            } else {
                throw new Error('City not found in OpenStreetMap');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    
    useEffect(() => {
        console.log('Updated cityName:', cityName);
    }, [cityName]);

    useEffect(() => {
        if (newLocation[0] !== 0 && newLocation[1] !== 0) {
            const sunrise = getSunrise(newLocation[0], newLocation[1]);
            const sunset = getSunset(newLocation[0], newLocation[1]);
            setSunTimes({
                sunrise: sunrise.toLocaleTimeString(),
                sunset: sunset.toLocaleTimeString(),
            });
        }
    }, [newLocation]);

    useEffect(() => {
        if (position && position[0] !== 0 && position[1] !== 0) {
            getResponse();
        }
    }, [position]);
    
    
    



    return (
        <div className="chat-container">
            {error && <div className="error">Error: {error}</div>}
            
            <h2>Another Location in the World:</h2>
            {cityName && <h3>{cityName}</h3>}
            
            <div className="sun-times">
            <p>Sunrise: {sunTimes.sunrise || 'Calculating...'}</p>
            <p>Sunset: {sunTimes.sunset || 'Calculating...'}</p>
            </div>
            

        </div>
    );
}



export default Chat;