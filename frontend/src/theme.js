import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFA726', // soft orange
    },
    secondary: {
      main: '#F48FB1', // warm pink
    },
    background: {
      default: '#FFF8E1', // light sunrise background
    },
    text: {
      primary: '#333333', // soft dark gray
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

export default theme;