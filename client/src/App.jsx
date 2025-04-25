
import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import Home from './pages/Home'
import History, {HistoryProvider} from './pages/History'
import './App.css';



function App() {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#ffa500' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SunSync
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/history">History</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <HistoryProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </HistoryProvider>
      </Box>
    </>
  )
}

export default App
