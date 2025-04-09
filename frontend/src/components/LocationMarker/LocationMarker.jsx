import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { getSunrise, getSunset } from 'sunrise-sunset-js';

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  useEffect(() => {
    const fetchSunriseSunset = async () => {
      try {
        const sunriseTime = await getSunrise(position.lat, position.lng);
        const sunsetTime = await getSunset(position.lat, position.lng);
        
        // Convert to local time and format
        const formatTime = (date) => {
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short'
          });
        };

        setSunrise(formatTime(sunriseTime));
        setSunset(formatTime(sunsetTime));
      } catch (error) {
        console.error('Error fetching sunrise/sunset:', error);
      }
    }
    if (position) {
      fetchSunriseSunset();
    }
  }, [position]);

  useMapEvents({
    click() {
      this.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      this.flyTo(e.latlng, this.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <h3 className="font-bold mb-2">Location Details</h3>
          <p>Latitude: {position.lat.toFixed(4)}</p>
          <p>Longitude: {position.lng.toFixed(4)}</p>
          {sunrise && <p>Sunrise: {sunrise}</p>}
          {sunset && <p>Sunset: {sunset}</p>}
        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker; 