import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
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
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
          {sunrise && <p>Sunrise: {sunrise}</p>}
          {sunset && <p>Sunset: {sunset}</p>}
        </div>
      </Popup>
    </Marker>
  );
}

const Map = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "80vh", width: "80vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
