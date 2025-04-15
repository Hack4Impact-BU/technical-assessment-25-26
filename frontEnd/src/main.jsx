import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/page1/app/app.jsx'
import Map from './components/page1/map/map.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
