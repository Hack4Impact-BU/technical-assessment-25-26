import './App.css'

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'  // import all map assets
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css'; // import what is used to customize the appearance of the map

import { getSunrise, getSunset } from 'sunrise-sunset-js';
import CustomPopup from './popup/popup';
import { marker } from 'leaflet';




class PreMarkerInfo {
    
    /**
     * @param {*} locationInfo
     */
    constructor(locationInfo)  {
        this.currentTime = locationInfo.timestamp || Date.now()
       
        const fixedCoordinates = locationInfo.latlng
        this.latitude = fixedCoordinates.lat
        this.longitude = fixedCoordinates.lng
        console.log(this.latitude); console.log(this.longitude)
      
        this.sunrise = getSunrise(this.latitude, this.longitude).toLocaleTimeString() // strings
        this.sunset = getSunset(this.latitude, this.longitude).toLocaleTimeString() 
    }

}

function normalizeCoordinates(lat, lng) {
    // Normalize latitude to be within -90 to 90
    const normalizedLat = Math.max(Math.min(lat, 90), -90);

    // Normalize longitude to be within -180 to 180
    let normalizedLng = ((lng + 180) % 360);
    if (normalizedLng <= -180) normalizedLng += 360;

    return { lat: normalizedLat, lng: normalizedLng };
}

 /* Give similar information about a country in a ocmpletely different part of the world*/
 async function requestInformation(preMarkerInfo) {

    let normalizedCoords = normalizeCoordinates(preMarkerInfo.latitude, preMarkerInfo.longitude)
    var userInput = `${preMarkerInfo.currentTime}: ( ${normalizedCoords.lat},  ${normalizedCoords.lng} )`

    const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInput }) // send a post request with the given coordinates
    })

    if (!response.ok) {
        throw new Error('Oops, something went wrong!')
    }
    else { // send back the response as a json object
        const { message } = await response.json()
        if(message == 'Oops, something went wrong!') { throw new Error('Oops, something went wrong!') }
        let cleanedString = message.replace(/```json\n|\n```/g, '');  // Removes the backticks and json header/footer

        return JSON.parse(cleanedString)
  
    }

}



function LocationMarker() {
    
    const [markerInfo, setMarkerInfo] = useState(null) // a null object
    const [postInfo, setPostInfo] = useState({})
    
    //... converts to a string object
    function retrieveInfo(locationInfo) {
        var _markerInfo = new PreMarkerInfo(locationInfo)
        setMarkerInfo(_markerInfo) 
        sessionStorage.setItem('markerInfo', JSON.stringify(_markerInfo)) // persist data across refreshes

        console.log(_markerInfo)
        requestInformation(_markerInfo).then(
            response => {
                setPostInfo(response) // sets the json response
                sessionStorage.setItem('postInfo', JSON.stringify(response)) // persist data across refreshes

                let normalizedCoords = normalizeCoordinates(_markerInfo.latitude, _markerInfo.longitude)
                addToHistory({lat: normalizedCoords.lat, lng: normalizedCoords.lng}, response).catch(error => console.log(error))
            }
        ).catch(error => { setPostInfo({}); console.log(error)})

    } 

    function makeRequest(e) { // we save the location in case of refresh, 
        if(e) { retrieveInfo(e) }
    }

    // Usage of map events to extract current location
    const map = useMapEvents({ 
        click(e) { map.setView(e.latlng, map.getZoom(16)); makeRequest(e) },
        locationfound(e) { if (e) { map.setView(e.latlng, map.getZoom(16)); makeRequest(e) }} })  // when user location has been found

    useEffect(() => { // on startup...
        const _markerInfo = sessionStorage.getItem('markerInfo') // it is going to be a string
      

        if(_markerInfo == null) { map.locate() } // if we do not have a location, then we find current user location
        else { 
            const jsonMarkerInfo = JSON.parse(_markerInfo)
            map.setView([jsonMarkerInfo.latitude, jsonMarkerInfo.longitude], map.getZoom(16))
            setMarkerInfo(jsonMarkerInfo)
            setPostInfo(JSON.parse(sessionStorage.getItem('postInfo')))
        } 
    }, [map]) // run once (initially, we go to where user location is)
    

    return markerInfo === null ? null : (<>
        <CustomPopup 
            currentLocation={[markerInfo.latitude, markerInfo.longitude]}
            suntimes={[markerInfo.sunrise, markerInfo.sunset]} 
            jsonResponse={postInfo}    
         />
    </>)

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

    return (
        <>
            <div id="Title">
                <h1>
                    See the times for sunrises and sunsets anywhere in the world by simply clicking anywhere on the map! 
                    Also find out another random place in the world that has similar solar times and a fun fact about it!
                </h1>
                <br></br>
            </div>
            <div id ="MapContain"> 
                {/* Underneath is a map */}
           
                <MapContainer id="Map" center={  {lat: 0.00, lng: 0.00} } 
                minZoom={2}
                zoom={13}
                scrollWheelZoom={false}>

                    
                    <TileLayer
                       url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                       attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
                       minZoom={2}
                    />
                
                    <LocationMarker/>
                </MapContainer>
            
            </div>
        </>
    )
}



export default App