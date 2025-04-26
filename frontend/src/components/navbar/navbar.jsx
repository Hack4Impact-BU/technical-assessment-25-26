import './navbar.css'
import Map from '../map/map'


import { useState }from 'react'

function Navbar() {
    var [displayInfo, setInfoDisplay] = useState(true)

    function infoClick(){
        setInfoDisplay(true)
        console.log(displayInfo)
    }
    function historyClick(){
        setInfoDisplay(false)
        console.log(displayInfo)
    }

    return (
        <>
        <div id = "navbar">
            <h1 id = "logo">Rise & Set</h1>
        </div>
        <Map/>
        </>
    )
}

export default Navbar