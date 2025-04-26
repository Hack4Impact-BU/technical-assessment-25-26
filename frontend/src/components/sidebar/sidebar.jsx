import './sidebar.css'

import { useState, useEffect } from 'react'

function Sidebar({latitude, longitude, location, sunset, sunrise, message}){
    var [dbHistory, setDbHistory] = useState([])

     //add onclick here to function in map that sets lat long and location!!!!!!!!!!!
        function HistoryElement({latitude, longitude, city}){
            return (
                <>
                <button className ='historyElement'>
                    
                        <p>LAT: {latitude}</p>
                        <p>LONG: {longitude}</p>
                        <p>CITY: {location}</p>
                </button>
                </>
            )
        }
    
        //Use effect every time history sidebar is toggled
        useEffect(() =>{
            fetch('http://localhost:8888/history')
                .then(res => res.json())
                .then(data => {
                    let newDbHistory = []
                        for (let i = 0; i < data.length; i++){
                            newDbHistory.push(data[i])
                        }
                        setDbHistory(newDbHistory)
                        console.log(dbHistory)
                })
        })
    
        function clearHistory(){
            try{
                console.log('[BACKEND] Deleting History')
                const response = fetch('http://localhost:8888/clear')
                console.log('[BACKEND] History Deleted')
                console.log(response)
    
                if (!response.ok){
                    throw new Error('Oops, something went wrong w/ response while deleting history')
                }
            }catch (error){
                console.error(error)
                return 'Oops, something went wrong! with entire thing'
            }
            
        }

    return(

        <div className = "sidebar">
            <ul>
                <li>
                    <h3>LATITUDE: { latitude }</h3>
                </li>
                <li>
                    <h3>LONGITUDE: { longitude }</h3>
                </li>
                <li>
                    <h3>CITY: { location }</h3>
                </li>
                <li>
                    <h3>SUNRISE: { sunset }</h3>
                </li>
                <li>
                    <h3>SUNSET: { sunrise }</h3>
                </li>
            </ul>
            <p classname ="smalltext"> Somewhere far away with a similar sunrise/sunset times: </p>
            <p id = "CityName">  {message.split('|', 2)[0]}</p>
            <p classname ="smalltext">{message.split('|', 2)[1]}</p>

        <h2>History</h2>
        <button id="clearButton" onClick= {() => clearHistory()}>
        Clear History
    </button>
        {dbHistory.map((object) => {
            return(<HistoryElement latitude = {object.latitude}
                longitude = {object.longitude}
                location = {object.location}/>)
            })}
    </div>

    )
}

export default Sidebar
