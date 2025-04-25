export async function getSunriseSunset(lat, lng) {
    const response = await fetch('/api/sunrise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lat, lng })
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch sunrise/sunset data');
    }
  
    return response.json();
  }