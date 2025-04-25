import { useState } from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
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
                <Button variant="outlined" onClick={() => handleChange(0)}>
                    Ye Map
                </Button>
                <Button variant="outlined" onClick={() => handleChange(1)}>
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