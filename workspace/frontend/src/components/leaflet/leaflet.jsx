import { MapContainer, TileLayer, Marker, Popup,useMapEvents,  } from 'react-leaflet'
import {useState, } from "react";
import './leaflet.css'
import 'leaflet/dist/leaflet.css'
//import Chat from '../chat/chat.jsx'

export default function Leaflet() {
    const [position, setPosition] = useState(null)
    const [sunInfo, setSunInfo] = useState(["", ""])
    //const [geminiInput, setGeminiInput] = useState("");
    const [geminiOutput, setGeminiOutput] = useState("");



//function to create a popup wherever the user clicks on the map
    function  LocationMarker() {



        const map = useMapEvents({
            click  (e) {

                const lat = e.latlng.lat
                const lng = e.latlng.lng
                setPosition(e.latlng)
                //setGeminiInput(e.latlng)
                map.flyTo(e.latlng, map.getZoom())



                fetch('http://localhost:4000/sunrise-sunset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userInput: {
                            latitude: lat,
                            longitude: lng
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        setSunInfo(data.message)
                        console.log("setting sunInfo useState to ",data.message)
                        const GeminiInput = `lat: ${lat},lng: ${lng} Sunrise & Sunset times ${data.message}`
                        const suntimes = data.message
                        fetch('http://localhost:4000/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({userInput: GeminiInput})
                        })
                            .then(res => res.json())
                            .then(data => {
                                setGeminiOutput(data.message)
                                console.log("setting sunInfo useState to ",data.message)



                                fetch('http://localhost:4000/add', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'

                                    },
                                    body: JSON.stringify({input:
                                            {
                                            latitude: lat,
                                            longitude: lng,
                                            suntimes: suntimes,
                                                gemini: data.message
                                            }
                                    })
                                })
                                .then(res => res.json())
                                .then(data => {
                                    console.log("adding new data: ",data.message)
                                })
                                .catch(err => {
                                    console.error("Error while posting to /add route:", err);
                                });






                            })
                            .catch(err => {
                                console.error("Gemini error:", err)
                                setGeminiOutput("error getting gemini results")

                            })


                    })
                    .catch(err => {
                        console.error("API error:", err)
                        setSunInfo(["Error fetching sun times","Error fetching sun times"])
                    })




            //click { close
            }




         //mapevent ({ close
        })



        return position === null ? null : (

            <Marker position={position}>
                <Popup>
                    You are here at position
                    <br />
                    Latitude: {position.lat}
                    <br/>
                    Longitude: {position.lng}
                    <br/>
                    Sunrise: {new Date(sunInfo[0]).toLocaleTimeString()}
                    <br/>
                    Sunset: {new Date(sunInfo[1]).toLocaleTimeString()}
                    <br/>
                     <p style = {{whiteSpace: 'pre-wrap'}}>Similar Location: {geminiOutput} </p>

                </Popup>
            </Marker>
        )
    }





    return (
            <div id='leafletContainer'>


            <h1>Click on your marker to get sunset information!</h1>
            <div id="map">
                <MapContainer center={[42.345, -71.103]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[42.345, -71.103]}>
                        <Popup>
                            This is where I&#39;m from!

                        </Popup>
                    </Marker>
                    <LocationMarker></LocationMarker>
                </MapContainer>
            </div>
            </div>
    )
}