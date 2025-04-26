// src/hooks/useCityCoordinates.js
import { useState, useEffect } from 'react';
import { getCoordinates } from '../services/geocodingService';

export default function useCityCoordinates(cityName) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track mounted state

    const fetchCoordinates = async () => {
      if (!cityName?.trim()) {
        if (isMounted) setCoordinates(null);
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const coords = await getCoordinates(cityName);

        if (isMounted) {
          setCoordinates([coords.lat, coords.lon]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setCoordinates(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCoordinates();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [cityName]);

  return { coordinates, loading, error };
}