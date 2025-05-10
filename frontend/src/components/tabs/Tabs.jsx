import { useState } from 'react';
import { Button } from '@mui/material';
import Map from '../map/Map';
import History from '../history/History';
import './Tabs.css';

const Tabs = () => {
    const [page, setPage] = useState(0);

    const handleChange = (event) => {
        setPage(event)
    };

    return (
        <>
            <div className="button_container">
                <Button variant="contained" id="map_button" onClick={() => handleChange(0)}>
                    YE MAP<img id="skull_img" src="../../../skull.png"/>
                </Button>
                <Button variant="contained" id="voyage_button" sx={{fontFamily: "Pirata One", fontSize: "20px"}} onClick={() => handleChange(1)}>
                    LOG O' VOYAGES
                </Button>
            </div>
            <div className="body_container">
                {page == 0 ? <Map/> : <History/>}
            </div>
        </>
    )
}

export default Tabs;