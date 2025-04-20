import './home.css'
import Button from '@mui/material/Button';
import React from 'react'
import Map from '../map/map.jsx'

function Home() {
    return (
    <>
        <h1>
            <span>Oh, the places you *want* to go.</span>
        </h1>
        
         <Map />
        

         <Button id='history' variant='contained' href="/history"> <h2>History</h2> </Button>


        <div id="projects">
            <h2>Projects</h2>
        </div>

        <div id="exp">
            <h2>Experiences</h2>
        </div>
    </>
    )
}
export default Home