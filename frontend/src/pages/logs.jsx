import './logs.css';
import React from 'react';
import logo from '../assets/d2dlogo.png';
import { useEffect, useState } from 'react';

function Logs(){
    const [logs, setLogs] = useState([]);

        useEffect(() => {
            const fetchLogs = async () => {
                try {
                    const response = await fetch('https://technical-assessment-25-26-production.up.railway.app/logs');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setLogs(data);
                } catch (error) {
                    console.error('Error fetching logs:', error);
                }
            };
    
            fetchLogs();
        }, []);

        const deleteLog = async (id) => {
            try {
                const response = await fetch(`https://technical-assessment-25-26-production.up.railway.app/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id}),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
            } catch (error) {
                console.error('Error deleting log:', error);
            }
        };


        


    return (
        <div className="logs">
            <img src={logo} alt="logo" className="logsLogo" />
            <div className="logsContainer">
                <ul>
                    {logs.map((log) => (
                        <li key={log._id}>
                            <div id="wrapper">
                                <div id="textbox">
                                    <p><strong>Location:</strong> {log.userLocation}</p>
                                    <p><strong>Similar Location:</strong> {log.similarPlace}</p>
                                    <p><strong>Timestamp:</strong> {log.timestamp}</p>
                                </div>
                                <button className="x" onClick={() => deleteLog(log._id)}>x</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Logs;