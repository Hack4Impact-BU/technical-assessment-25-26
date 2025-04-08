import React, { useState } from "react";

export default function Row({ item, index }) {
    /* 
        Component: Row
        Row for the History Table
    */

    const {
        lat,
        lng,
        sunrise,
        sunset,
        geminiLocation
        } = item;

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>{lat.toFixed(2)}</td>
                <td>{lng.toFixed(2)}</td>
                <td>{sunrise}</td>
                <td>{sunset}</td>
                <td>{geminiLocation}</td>
            </tr>
        </>
    );
}