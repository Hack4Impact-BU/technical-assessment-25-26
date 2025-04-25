import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { HistoryProvider } from './pages/History';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HistoryProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HistoryProvider>
  </React.StrictMode>
)
