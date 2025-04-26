import './history.css'

import { useState, useEffect } from 'react'


import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';




function History(){
    var [dbHistory, setDbHistory] = useState([])

    //add onclick here to function in map that sets lat long and location!!!!!!!!!!!
    function HistoryElement({latitude, longitude, location}){
        return (
            <>
            <button className ='historyElement'>
                
                    <p>LAT: {latitude}</p>
                    <p>LONG: {longitude}</p>
                    <p>LOCATION: {location}</p>
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



    return (
        <>
        <div className="sidebar">
            <button className = "button" onClick= {() => clearHistory()}>
                Clear History
            </button>
            <div className='historyScroll'>
                {dbHistory.map((object) => {
                    return(<HistoryElement latitude = {object.latitude}
                        longitude = {object.longitude}
                        location = {object.location}/>)
                })}
            </div>
        </div>
        </>
    )
}

export default History