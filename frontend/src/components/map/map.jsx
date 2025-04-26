import './map.css'
import 'leaflet/dist/leaflet.css'
import  Sidebar  from '../sidebar/sidebar'
import History from '../history/history'

import { useState, useEffect} from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMapEvent } from 'react-leaflet'

import { getSunrise, getSunset } from 'sunrise-sunset-js';

import { useGeolocated } from "react-geolocated";

const userLocation = [42.361145, -71.057083]

function Map() {
    var [position, setPosition] = useState(userLocation)
    var [latitude, setLatitude] = useState(userLocation[0])
    var [longitude, setLongitude] = useState(userLocation[1])
    var [address, setAddress] = useState('')
    var [location, setLocation] = useState('Boston, Massachusetts')
    
    var [request, setRequest] = useState([])
    var [response, setResponse] = useState('waiting for response...')

    var [sunriseTime, setSunrise] = useState('00:00')
    var [sunsetTime, setSunset] = useState('00:00')

    var[historyElem, setHistoryElem] = useState([])

    function success(position){
        setLatitude(roundCoord(position.coords.latitude))
        setLongitude(roundCoord(position.coords.longitude))
        setPosition([latitude,longitude])

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(url).then(res=>res.json()).then(data=>setAddress(data.address))
        console.log(address)
        setLocation(
            (address.city != undefined)?
            (address.city + ', ' + address.country):
            (address.country), this.address)

        setSunrise(getSunrise(latitude,longitude).getHours().toString() + ":" + (getSunrise(latitude,longitude).getMinutes() < 10 ? ('0' + getSunrise(latitude,longitude).getMinutes().toString()):getSunrise(latitude,longitude).getMinutes().toString()))
        setSunset(getSunset(latitude,longitude).getHours().toString() + ":" + (getSunset(latitude,longitude).getMinutes() < 10 ? ('0' + getSunset(latitude,longitude).getMinutes().toString()):getSunset(latitude,longitude).getMinutes().toString()))
    }

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(success)
    }, [])

    function roundCoord(coord){
        return Math.round(coord * 1000000) / 1000000
    }
    
    function MapClick() {
        const map = useMapEvents({
            click(e){
                setPosition(e.latlng, this.position)   
                map.flyTo(e.latlng, map.getZoom())
                setLatitude(roundCoord(e.latlng.lat),this.latitude)
                setLongitude(roundCoord(e.latlng.lng),this.longitude)

                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                fetch(url).then(res=>res.json()).then(data=>setAddress(data.address))
                console.log(address)
                setLocation(
                    (address.city != undefined)?
                    (address.city + ', ' + address.country):
                    (address.country), this.address)

                setSunrise(getSunrise(latitude,longitude).getHours().toString() + ":" + (getSunrise(latitude,longitude).getMinutes() < 10 ? ('0' + getSunrise(latitude,longitude).getMinutes().toString()):getSunrise(latitude,longitude).getMinutes().toString()),this.sunriseTime)
                setSunset(getSunset(latitude,longitude).getHours().toString() + ":" + (getSunset(latitude,longitude).getMinutes() < 10 ? ('0' + getSunset(latitude,longitude).getMinutes().toString()):getSunset(latitude,longitude).getMinutes().toString()),this.sunsetTime)
                
                setRequest(`Give me information about a place in a different part of the world than ` + e.latlng.lat + " + " + e.latlng.lng + " with a similar sunrise time of " + sunriseTime + " and a similar sunset time of " + sunsetTime)
                console.log(request)

            }
        })
        return (
            <Marker position={position}>
                <Popup>Dont touch me</Popup>
            </Marker>
        )
    }

    useEffect(()=>{
        GemeniLocationInfo()
    }, [position])


    async function GemeniLocationInfo(){
            try {
            
            
            console.log('[GemeniLocationInfo] AI Request: ' + request)
            console.log(JSON.stringify(request))

            const response = await fetch('http://localhost:8888/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({ sunriseTime:sunriseTime, sunsetTime:sunsetTime, location: location})
            })
            console.log(response.ok)
            if (!response.ok){
                throw new Error('Oops, something went wrong w/ response!')
            }
            
            const  respMessage  = await response.json()
            console.log(respMessage.message)
            
            console.log("[GemeniLocationInfo] Response Message: " + respMessage.message)
            setResponse(respMessage.message)

            console.log("[GemeniLocationInfo] Adding sending log to backend: " + [latitude,longitude,location])
            fetch('http://localhost:8888/add', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude: latitude, longitude: longitude, location: location})
            })

            setHistoryElem([latitude,longitude,location])
            
        } catch (error){
            console.error(error)
            return 'Oops, something went wrong! with entire thing'
        }
    }

    return(
        <div id ="mapandsidebar">
            <div id = "sidebar">
                <Sidebar 
                    latitude = {latitude}
                    longitude = {longitude}
                    location={location}
                    sunrise={sunriseTime}
                    sunset={sunsetTime}
                    message = {response}/>
            </div>
            <div id = "map">
                <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClick/>
                </MapContainer>
            </div>
    </div>
    )
}

export default Map