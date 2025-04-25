import { useState, useEffect } from 'react';
// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './History.css';

const History = () => {
    const [voyages, setVoyages] = useState([]);

    useEffect(() => {
        fetchVoyages();
    }, []);

    const fetchVoyages = async () => {
        try {
            const response = await fetch('http://localhost:5000/fetchVoyages');

            if (!response.ok) {
                throw new Error("Failed to fetch voyages");
            }
            
            const data = await response.json();
            setVoyages(data);

        } catch (error) {
            console.error("Error fetching voyages", error);
        }
    }

    return (
        <>
            <h1>Yer Voyages</h1>
            <div className="voyage_table_container">
                <TableContainer>
                    <Table aria-label="voyage table" className="voyage_table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">YE LOCATION</TableCell>
                            <TableCell align="center">LONG</TableCell>
                            <TableCell align="center">LAT</TableCell>
                            <TableCell align="center">YE SUNRISE</TableCell>
                            <TableCell align="center">YE SUNSET</TableCell>
                            <TableCell align="center">YE VOYAGE</TableCell>
                            <TableCell align="center">YE VOYAGE SUNRISE</TableCell>
                            <TableCell align="center">YE align="center" VOYAGE SUNSET</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {voyages.map((voyage, index) => (
                            <TableRow key={index}>
                                    <TableCell align="center">{voyage.data.givenLocation}</TableCell>
                                    <TableCell align="center">{voyage.data.longitude}</TableCell>
                                    <TableCell align="center">{voyage.data.latitude}</TableCell>
                                    <TableCell align="center">{voyage.data.givenSunrise}</TableCell>
                                    <TableCell align="center">{voyage.data.givenSunset}</TableCell>
                                    <TableCell align="center">{voyage.data.foundLocation}</TableCell>
                                    <TableCell align="center">{voyage.data.foundSunrise}</TableCell>
                                    <TableCell align="center">{voyage.data?.foundSunset}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default History;