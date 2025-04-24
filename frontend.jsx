import './App.css'

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'  // import all map assets
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css'; // import what is used to customize the appearance of the map

import { getSunrise, getSunset } from 'sunrise-sunset-js';
import CustomPopup from './popup/popup';


class markerInfo {
    
    /**
     * 
     * @param {*} locationInfo 
     * @param {*} sunset 
     * @param {*} sunrise 
     * @param {*} jsonResponse
     */
    constructor(locationInfo, sunset, sunrise, jsonResponse)  {
        
    }
}


function LocationMarker() {
    
    const [markerInfo, setMarkerInfo] = useState(null) // a null object

    // const [currentLocation, setCurrentLocation] = useState(null)
    // const [suntimes, setSuntimes] = useState(["Unknown", "Unknown"])
    // const [jsonResponse, setJsonResponse] = useState({}) 
    
    function retrieveInfo(coordinate) {

        const {lat, lng} = coordinate
        const now = new Date()

        setSuntimes([
            getSunrise(lat, lng).toLocaleTimeString(), // given a coordinate, get the local sunrise/sunset time as a string
            getSunset(lat, lng).toLocaleTimeString()]) 
            requestInformation([lat, lng], now.toISOString()) // pass in the coordinates and the current time/date 
                    .then(response => { 
                        setJsonResponse(response);
                        
                        addToHistory(coordinate, response)
                        //.then(response => {}).catch(error => console.log(error))
                     }) // Set the response once the promise resolves 
                .catch(error => {
                    setJsonResponse({});  // Set empty object in case of error
                    console.log(error);    // Log the error
        });

    } 


    function makeRequest(e) {
        if(e) {
            console.log(e)
            sessionStorage.setItem('location', JSON.stringify(e.latlng)) // persist data across refreshes
            setCurrentLocation(e.latlng)
            retrieveInfo(e.latlng)
        }
    }


    // Usage of map events to extract current location
    const map = useMapEvents({ 
        click(e) { makeRequest(e) },
        locationfound(e) {  // when user location has been found
            if (e) { 

                map.flyTo(e.latlng, map.getZoom(16)); makeRequest(e) } 
        }
      })

    useEffect(() => {

        const location = sessionStorage.getItem('location')
 
        if(location == null) { 
            map.locate() // if we do not have a location, then we find current user location
        }
        else {
            makeRequest({'latlng': JSON.parse(location)}) 
        }
    }, [map]) // run once (initially, we go to where user location is)


    return currentLocation === null ? null : (<>
        <CustomPopup currentLocation={currentLocation} suntimes={suntimes} jsonResponse={jsonResponse}    />
    </>)

}


{/* Give similar information about a country in a ocmpletely different part of the world*/}
async function requestInformation(currentLocation) {

    var userInput = "(" +  currentLocation[0] + ", " +  currentLocation[1] + ")"

    const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInput })
    })
    if (!response.ok) {
        throw new Error('Oops, something went wrong!')
    }
    else {
        const { message } = await response.json()
        if(message == 'Oops, something went wrong!') { throw new Error('Oops, something went wrong!') }

        let cleanedString = message.replace(/```json\n|\n```/g, '');  // Removes the backticks and json header/footer
        return JSON.parse(cleanedString)
    }

}

async function addToHistory(currentLocation, message) {
    fetch('http://localhost:4000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: currentLocation, response: message })
        // our input is the currentLocation
    })
    console.log(JSON.stringify({ input: currentLocation, response: message }))

}


function App() {

    var currentLocation =  sessionStorage.getItem('location') 
    // sessionStorage.removeItem('location')
    if (currentLocation == null) { 
        currentLocation = {lat: 0.00, lng: 0.00}}
    else {
        currentLocation = JSON.parse(currentLocation)
    }
   

    return (
        <>
            <div id ="MapContain"> {/* Underneath is a map */}
           
                <MapContainer id="Map" center={ currentLocation } zoom={13} scrollWheelZoom={false}>

                    <TileLayer
                       url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                       attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
                    />
                
                    <LocationMarker/>
                </MapContainer>
            
            </div>
        </>
    )
}

export default App
