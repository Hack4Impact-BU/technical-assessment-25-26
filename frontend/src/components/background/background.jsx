import { useEffect, useState, useRef, useMemo } from 'react';
import './background.css';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import NewMarker from '../../assets/marker.png';

function Background() {
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [similarPlace, setSimilarPlace] = useState("");

    // defining the icon for the marker
    const MarkerIcon = L.icon({
        iconUrl: NewMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });


    // get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLocationLoaded(true);
                    getPlace(latitude, longitude);
                },
                (error) => {
                    console.error("error getting location", error);
                    setLocationLoaded(true);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLocationLoaded(true);
        }
    }, []);

    // to get the similar location
    const getSimilarPlace = async (location) => {
        if (!location) return;
        setSimilarPlace("Loading...");

        try {
            const response = await fetch('https://technical-assessment-25-26-production.up.railway.app/findSimilarPlace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userLocation: location }),
            });

            if (!response.ok) {
                console.log("Error fetching similar place");
            }

            const data = await response.json();
            setSimilarPlace(data.similarPlace);
        } catch (error) {
            console.error("Error fetching similar place:", error);
            setSimilarPlace("Error fetching similar place");
        } 
    }

    // to refresh the similar location everytime the user drags the marker
    useEffect(() => {
        if (locationLoaded) {
            getSimilarPlace(userLocation);
        }
    }, [userLocation, locationLoaded]);

    // for sunrise set times
    const sunset = getSunset(userLocation[0], userLocation[1]);
    const sunrise = getSunrise(userLocation[0], userLocation[1]);

    function DraggableMarker() {
        const markerRef = useRef(null);

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const newPosition = marker.getLatLng();
                        setUserLocation([newPosition.lat, newPosition.lng])
                }
                },
            }),
            [setUserLocation]
        );

        return (
            <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={userLocation}
            ref={markerRef}
            icon={MarkerIcon}
            >
                <Popup minWidth={150} className="popup">
                    <span>
                    <span style={{ color: "#FFB487" }}>sunrise: {sunrise.toLocaleTimeString()}</span> <br />
                    <span style={{ color: "#415777" }}>sunset: {sunset.toLocaleTimeString()}</span> <br />
                    <br />
                    <span style={{ color: "#151515" }}>your location has similar times to:</span> <br />
                    <span style={{ color: "#151515" }}>{similarPlace}</span>
                    </span>
                </Popup>
            </Marker>
        );
    }

    // return the background div
    return (
        <div className="bg">
            <div className="container">
                <div className="map">
                {locationLoaded && (
                <MapContainer 
                    center={userLocation} 
                    zoom={5} 
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker />
                </MapContainer>
                )}
                </div>
            </div>
        </div>
    )
}

export default Background