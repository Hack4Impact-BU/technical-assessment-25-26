import './history.css';
import React from 'react';
import { Link } from 'react-router-dom';



function History() {
    return (
        <div className="history-container">
            <h1>History</h1>
            <p>This is the history page.</p>
            <Link to="/">Go back to the map</Link>
        </div>
    )
}


export default History;