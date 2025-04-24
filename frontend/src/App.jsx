import { useState, useEffect } from 'react'
import './App.css'

function App() {
const [sunrise, setSunrise] = useState(null)
const [sunset, setSunset] = useState(null)

useEffect(() => {
  // Fetch sunrise and sunset times from an API
  fetchSunriseAndSunset()
}, [])

const fetchSunriseAndSunset = async () => {
  try {
    // Make an API request to get the sunrise and sunset times
    const response = await fetch('API_ENDPOINT')
    const data = await response.json()

    // Update the sunrise and sunset state variables
    setSunrise(data.sunrise)
    setSunset(data.sunset)
  } catch (error) {
    console.error('Error fetching sunrise and sunset times:', error)
  }
}

return (
  <>
    <div className="map">
      {/* Display the map component */}
      <Map />
    </div>
    <div className="sunrise-sunset">
      {/* Display the sunrise and sunset times */}
      <p>Sunrise: {sunrise}</p>
      <p>Sunset: {sunset}</p>
    </div>
  </>
)
}

export default App

