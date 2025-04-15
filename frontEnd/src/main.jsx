import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/page1/app/app.jsx'
import Map from './components/page1/map/map.jsx'
import Buttonn from './components/page1/app/button.jsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
        <Map />
        </StrictMode>,
)
