import React, { useState,  useContext } from 'react'
import { ThemeContext } from '../frame/frame'

export default function Row({ item, index }) {
    /* 
        Component: Row
        Row for the History Table
    */

    const [theme, setTheme] = useContext(ThemeContext);

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
                <td>{sunrise}</td>
                <td>{sunset}</td>
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
                    <td colSpan="7" style={{ background: "#222", color: "#eee" }}>
                        {geminiLocation.info}
                    </td>
                </tr>
            )}
        </>
    );
}