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
            <h1>Find Ye Booty</h1>
            <div className="voyage_table_container">
                <TableContainer>
                    <Table aria-label="voyage table" className="voyage_table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE LOCATION</TableCell>
                            {/* <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>LONG</TableCell>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>LAT</TableCell> */}
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE SUNRISE</TableCell>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE SUNSET</TableCell>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE VOYAGE</TableCell>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE VOYAGE SUNRISE</TableCell>
                            <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "25px"}}>YE VOYAGE SUNSET</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {voyages.map((voyage, index) => (
                            <TableRow key={index} className="voyage_info_container">
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.givenLocation} ({voyage.data.latitude}, {voyage.data.longitude})</TableCell>
                                    {/* <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.longitude}</TableCell> */}
                                    {/* <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.latitude}</TableCell> */}
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.givenSunrise}</TableCell>
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.givenSunset}</TableCell>
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.foundLocation} ({voyage.data.foundLat}, {voyage.data.foundLong})</TableCell>
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.foundSunrise}</TableCell>
                                    <TableCell align="center" sx={{fontFamily:"Pirata One", fontSize: "15px"}}>{voyage.data.foundSunset}</TableCell>
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