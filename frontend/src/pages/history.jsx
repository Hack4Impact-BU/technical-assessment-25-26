import React, { useEffect, useState } from "react";
import Frame from "../components/frame/frame";
import Table from "../components/table/table";

export default function History() {
    /* 
        Route (Page): /history
        Component: History
        Surves the history page of the app, and retreives and displays history data from backend api.
    */

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/history")
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Failed to fetch history:", err));
    }, []);

    return (
        <Frame>
            <h2 style={{ color: "white", marginBottom: "1rem" }}>📍 History</h2>
            <Table data={data} />
        </Frame>
    );
}