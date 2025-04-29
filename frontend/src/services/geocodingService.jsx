export async function getCoordinates(cityName) {
    if (!cityName?.trim()) {
      throw new Error('City name is required');
    }
  
    try {
      const response = await fetch(
        `http://localhost:4000/api/nominatim?q=${encodeURIComponent(cityName)}`,
        {
          headers: {
            'User-Agent': 'Sundial/1.0 (ajh756.404@gmail.com)',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data?.[0]?.lat || !data?.[0]?.lon) {
        throw new Error('Invalid coordinate data received');
      }
      console.log(data)
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw new Error(`Could not find coordinates for "${cityName}"`);
    }
  }