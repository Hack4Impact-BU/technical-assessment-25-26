import { Box, Typography } from '@mui/material'
import MapView from '../components/MapView'
import { useState } from 'react'
import { useHistory } from './History';


function Home() {
    const [sunData, setSunData] = useState(null)
    const [similarLocation, setSimilarLocation] = useState(null)
    const { addToHistory } = useHistory();

    const handleMapClick = async (lat, lng) => {
        console.log(`Clicked location: ${lat}, ${lng}`)
        try {
            const response = await fetch('http://localhost:5001/api/sunrise-sunset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lat, lng }),
            })

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(typeof data);


                setSunData(data);

                const { sunriseISO, sunsetISO, daylightHours } = data;

                //similar location using Geminni
                const geminiRes = await fetch('http://localhost:5001/api/similar-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sunriseISO: data.sunriseISO,
                        sunsetISO: data.sunsetISO,
                        lat,
                        lng
                    }),
                });
                if (geminiRes.ok) {
                    const geminiData = await geminiRes.json();


                    if (geminiData && geminiData.location) {
                        console.log("Gemini full location:", geminiData);
                        setSimilarLocation(geminiData.location); // Set the similar location from response
                        console.log("Type:", typeof geminiData.location);

                        addToHistory({
                            lat,
                            lng,
                            sunriseISO: data.sunriseISO,
                            sunsetISO: data.sunsetISO,
                            daylightHours: data.daylightHours,
                            response: geminiData.location
                        });


                    } else {
                        console.error('Similar location data is missing');
                        setSimilarLocation(null); // Reset if there's an issue
                    }
                } else {
                    console.error("Failed to get similar location");
                }

            } else {
                console.error('Failed to fetch data');
            }
        } catch (err) {
            console.error('Error fetching sun data:', err)
        }
    }

    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                🌅 Welcome to SunSync 🌄
            </Typography>
            <Typography variant="h8" color="text.secondary">
                Discover sunrise and sunset times across the globe
            </Typography>

            <Box
                sx={{
                    height: '500px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '16px',
                    mt: 4,
                }}
            >
                <MapView onMapClick={handleMapClick} sunData={sunData} similarLocation={similarLocation} />
            </Box>
        </Box>
    )
}

export default Home