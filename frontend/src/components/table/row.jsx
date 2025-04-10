import React, { useState,  useContext } from 'react'
import { ThemeContext, TimeContext } from '../frame/frame'

function formatTime(date, timeZone) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }

export default function Row({ item, index }) {
    /* 
        Component: Row
        Row for the History Table
    */

    const [theme, _] = useContext(ThemeContext);
    const [timeZone, setTimeZone] = useContext(TimeContext);

    
    const {
        lat,
        lng,
        sunrise,
        sunset,
        geminiLocation
        } = item;

    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>{lat.toFixed(2)}</td>
                <td>{lng.toFixed(2)}</td>
                <td>{formatTime(sunrise, timeZone)}</td>
                <td>{formatTime(sunset, timeZone)}</td>
                <td>{`${geminiLocation.place}, ${geminiLocation.region}`}</td>
             <td>
                    {geminiLocation.info !== "N/A" && (
                        <button onClick={() => setShowInfo(prev => !prev)}>
                            {showInfo ? "Hide" : "View"}
                        </button> 
                    )}
                </td>
            </tr>
            {showInfo && geminiLocation.info !== "N/A" && (
                <tr>
                    <td colSpan="7" style={{ color: theme ? '#eee' : '#eee', background: theme ? "#222" : "#324977" }}>
                        {geminiLocation.info}
                    </td>
                </tr>
            )}
        </>
    );
}