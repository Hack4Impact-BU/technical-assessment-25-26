import React, { useState,  useEffect} from 'react'
import Frame from '../components/frame/frame'
import Table from "../components/table/table";
import { getSecureBrowserIdentity } from '../components/global/signaturesClient';

export default function History() {
    /* 
        Route (Page): /history
        Component: History
        Surves the history page of the app, and retreives and displays history data from backend api.
    */

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { browserId, signature } = await getSecureBrowserIdentity();
                const res = await fetch("http://localhost:3000/api/history", {
                    headers: {
                        "x-browser-id": browserId,
                        "x-browser-signature": signature
                    }
                });
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <Frame>
            <Table data={data} />
        </Frame>
    );
}