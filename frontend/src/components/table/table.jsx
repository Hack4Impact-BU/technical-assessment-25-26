import React from "react";
import Row from "./row";
import "./table.css";

export default function Table({ data }) {
    /* 
        Component: Table
        Table that displays marker history in a nice readible format.
    */
   
    if (!data || data.length === 0) {
        return <p style={{ color: "#ccc" }}>No history yet.</p>;
    }

    return (
        <div className="table-container">
        <table className="history-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Lat</th>
                    <th>Lng</th>
                    <th>Sunrise</th>
                    <th>Sunset</th>
                    <th>Similar Place</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => (
                    <Row key={item._id || i} index={i} item={item} />
                ))}
            </tbody>
        </table>
        </div>
    );
}