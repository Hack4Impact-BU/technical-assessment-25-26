import React, { useContext } from 'react'
import { ThemeContext } from '../frame/contexts';
import Row from "./row";
import "./table.css";

export default function Table({ data }) {
    /* 
        Component: Table
        Table that displays marker history in a nice readible format.
    */
    const [theme] = useContext(ThemeContext);

    if (!data || data.length === 0) {
        return <p style={{ color: "#ccc" }}>No history yet.</p>;
    }

    return (
        <>
        <div className={`table-container ${!theme ? "table-container-light" : ""}`}>
        <table className={`history-table ${!theme ? "history-table-light" : ""}`}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Lat</th>
                    <th>Lng</th>
                    <th>Sunrise</th>
                    <th>Sunset</th>
                    <th>Similar Place</th>
                    <th>Info</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => (
                    <Row key={item._id || i} index={i} item={item} />
                ))}
            </tbody>
        </table>
        </div>
        </>
    );
}