import { useState, useEffect } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import './chat.css';

function Chat({ position }) {
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState([0, 0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    const [sunTimes, setSunTimes] = useState({
        sunrise: '',
        sunset: ''
    });

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
            
            // 2. Fetch coordinates from OpenStreetMap
            const osmResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fetchedCityName)}`
            );
            
            if (!osmResponse.ok) {
                throw new Error('Failed to fetch coordinates');
            }

            const osmData = await osmResponse.json();
            console.log('OSM Data:', osmData);

            if (osmData.length > 0) {
                const firstResult = osmData[0];
                const newLocation = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
                setLocation(newLocation);

                // Calculate sunrise/sunset times
                const sunrise = getSunrise(newLocation[0], newLocation[1]);
                const sunset = getSunset(newLocation[0], newLocation[1]);
                setSunTimes({
                    sunrise: sunrise.toTimeString(),
                    sunset: sunset.toTimeString()
                });

                // 3. Save to your backend
                await fetch('http://localhost:4000/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        input: position, 
                        response: newLocation,
                        cityName: fetchedCityName
                    })
                });

                setLocations(prev => [...prev, {
                    position,
                    location: newLocation,
                    cityName: fetchedCityName
                }]);
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
        // Load initial logs
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:4000/logs');
                if (!response.ok) {
                    throw new Error('Failed to load logs');
                }
                const data = await response.json();
                const newLocations = data.map(item => ({
                    position: item.input,
                    location: item.response,
                    cityName: item.cityName || 'Unknown'
                }));
                setLocations(newLocations);
            } catch (error) {
                console.error('Error loading logs:', error);
                setError(error.message);
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        // Call getResponse when position changes
        if (position && position[0] !== 0 && position[1] !== 0) {
            getResponse();
        }
    }, [position]);


    return (
        <div className="chat-container">
            {isLoading && <div className="loading">Finding matching location...</div>}
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