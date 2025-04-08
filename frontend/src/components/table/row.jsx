import React, { useState } from "react";

export default function Row({ item, index }) {
    /* 
        Component: Row
        Row for the History Table
    */

    const [expanded, setExpanded] = useState(false);

    const {
        lat,
        lng,
        timestamp,
        geminiLocation,
        geminiRawResponse
    } = item;

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>{lat.toFixed(2)}</td>
                <td>{lng.toFixed(2)}</td>
                <td>{new Date(timestamp).toLocaleString()}</td>
                <td>{geminiLocation}</td>
                <td>
                    <button onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Hide" : "View"}
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan="6">
                        <pre style={{ whiteSpace: "pre-wrap", color: "#ccc", background: "#111", padding: "1rem", borderRadius: "10px" }}>
                            {JSON.stringify(geminiRawResponse, null, 2)}
                        </pre>
                    </td>
                </tr>
            )}
        </>
    );
}