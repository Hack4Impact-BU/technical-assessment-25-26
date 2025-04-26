import { useState } from 'react'
import { getSunrise, getSunset } from 'sunrise-sunset-js'

function LocationButton() {
    const [sunData, setSunData] = useState(null)

    const handleClick = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const sunrise = getSunrise(lat, lng)
        const sunset = getSunset(lat, lng)

        const response = await fetch('http://localhost:5000/api/sunrise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }), 
        });
    

        const data = await response.json()
        setSunData(data)
    })
    }

    return (
    <div>
        <button onClick={handleClick}>Get Sunrise & Sunset Info</button>
        {sunData && (
        <div>
            <p><strong>Sunrise:</strong> {sunData.sunrise}</p>
            <p><strong>Sunset:</strong> {sunData.sunset}</p>
            <p><strong>Gemini Suggestion:</strong> {sunData.suggestion}</p>
        </div>
        )}
    </div>
    )
}

export default LocationButton
