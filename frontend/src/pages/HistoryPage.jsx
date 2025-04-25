import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

export default function HistoryPage() {
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        fetch(`http://localhost:4000/history?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data) =>
                setRows(
                    data.map((item) => ({
                        id: item._id,
                        lat: item.lat,
                        lon: item.lon,
                        location: item.location,
                        suggested: `${item.suggested.city}, ${item.suggested.country}`,
                        timestamp: new Date(item.createdAt).toLocaleString(),
                    }))
                )
            )
            .catch(console.error);
    }, []);

    const handleToggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleToggleAll = () => {
        if (selected.length === rows.length) {
            setSelected([]);
        } else {
            setSelected(rows.map((r) => r.id)); 
        }
    };

    const handleDelete = () => {
        const sessionId = localStorage.getItem('sessionId');
        fetch('http://localhost:4000/history', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, ids: selected }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Delete failed');
                setRows((prev) => prev.filter((r) => !selected.includes(r.id)));
                setSelected([]);
            })
            .catch(console.error);
    };

    const allSelected = rows.length > 0 && selected.length === rows.length;
    const indeterminate = selected.length > 0 && selected.length < rows.length;

    return (
        <Box sx={{ p: 2 }} className="font-serif">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Typography variant="h4" className="font-serif">
                    Your Past Clicks
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={selected.length === 0}
                    className= "font-sans sunset-600 hover:bg-sunset-700 transition duration-200"
                >
                    Clear Selected
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={indeterminate}
                                    checked={allSelected}
                                    onChange={handleToggleAll}
                                />
                            </TableCell>
                            <TableCell className="font-sans">Latitude</TableCell>
                            <TableCell className="font-sans">Longitude</TableCell>
                            <TableCell className="font-sans">Location</TableCell>
                            <TableCell className="font-sans">Suggested Match</TableCell>
                            <TableCell className="font-sans">Clicked At</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(row.id)}
                                        onChange={() => handleToggle(row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.lat.toFixed(4)}</TableCell>
                                <TableCell>{row.lon.toFixed(4)}</TableCell>
                                <TableCell>{row.location}</TableCell>
                                <TableCell>{row.suggested}</TableCell>
                                <TableCell>{row.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
