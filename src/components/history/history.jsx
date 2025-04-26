import React, { useEffect, useState } from 'react';
import './history.css';

function History() {
    const [markers, setMarkers] = useState([]);

    const fetchMarkers = async () => {
        try {
            console.log('Fetching markers from backend...');
            const response = await fetch('http://localhost:4000/api/markers'); // Fetch from the backend
            console.log('Response status:', response.status); // Log response status

            if (!response.ok) {
                throw new Error('Failed to fetch markers');
            }

            const data = await response.json(); // Parse the JSON response
            console.log('Fetched markers:', data); // Log the fetched data
            setMarkers(data); // Update the state with the fetched markers
        } catch (error) {
            console.error('Error fetching markers:', error);
        }
    };

    useEffect(() => {
        fetchMarkers();
    }, []);

    useEffect(() => {
        console.log('Markers state updated:', markers); // Log the markers state whenever it changes
    }, [markers]);
    

    return (
        <div className="history-container">
            <h1>Saved Markers</h1>
            <ul className="history-list">
                {markers.map((marker, index) => (
                    <li key={index} className="history-item">
                        <strong>Latitude:</strong> {marker.lat}, <strong>Longitude:</strong> {marker.lng}, <strong>Gemini Output:</strong> {marker.geminiOutput}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default History;