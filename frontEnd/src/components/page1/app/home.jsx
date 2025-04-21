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

        <Button id='history' href="/history"> <h2>History</h2> </Button>
    </>
    )
}
export default Home