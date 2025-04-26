import { useEffect, useState } from 'react';
import { getHistory } from '../api/historyAPI';
import { Typography, Box, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(data => {
      setHistory(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Click History</Typography>

      {loading ? <CircularProgress /> : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Sunrise</TableCell>
              <TableCell>Sunset</TableCell>
              <TableCell>Time Clicked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>{entry.lat.toFixed(4)}</TableCell>
                <TableCell>{entry.lng.toFixed(4)}</TableCell>
                <TableCell>{new Date(entry.sunrise).toLocaleTimeString()}</TableCell>
                <TableCell>{new Date(entry.sunset).toLocaleTimeString()}</TableCell>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}