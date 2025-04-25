import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material'
import { createContext, useState, useContext } from 'react';

// context object
const HistoryContext = createContext();

// custom hook 
export const useHistory = () => useContext(HistoryContext);

// component wraps app and gives it access to the context
export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);

    const addToHistory = (entry) => {
        setHistory(prev => [...prev, entry]);
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};


function History() {
    const { history } = useHistory();

    return (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom> Location History</Typography>

            {history.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    Your tapped locations will show up here!
                </Typography>
            ) : (
                <List sx={{ maxWidth: 700, mx: 'auto', mt: 3 }}>
                    {history.map((entry, index) => (
                        <Paper
                            key={index}
                            elevation={3}
                            sx={{
                                mb: 2,
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: '#fefefe',
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 6,
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            <ListItem disableGutters>
                                <ListItemText
                                    primary={`📍 Lat: ${entry.lat.toFixed(2)}, Lng: ${entry.lng.toFixed(2)}`}
                                    secondary={`Similar location: ${entry.response}`}
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default History