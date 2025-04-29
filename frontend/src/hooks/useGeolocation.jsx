import { useState, useEffect } from 'react';

function useGeolocation(defaultPosition = [34.05223, -118.24368]) {
  const [position, setPosition] = useState(defaultPosition);
  const [locationFound, setLocationFound] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by your browser'));
      setIsLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!isNaN(latitude) && !isNaN(longitude)) {
          setPosition([latitude, longitude]);
          setLocationFound(true);
          setError(null);
        } else {
          setError(new Error('Invalid coordinates received'));
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setLocationFound(false);
        setIsLoading(false);
      },
      geoOptions
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return {
    position,
    locationFound,
    error,
    isLoading
  };
}

export default useGeolocation;