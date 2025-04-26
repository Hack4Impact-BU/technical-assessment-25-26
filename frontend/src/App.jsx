import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontFamily: 'cursive' }}>
            Sol Atlas
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/history">History</Button>
        </Toolbar>
      </AppBar>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}