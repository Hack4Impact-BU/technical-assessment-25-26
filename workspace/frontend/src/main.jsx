import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './navbar/navbar.jsx'
import App from './App.jsx'
import History from './History.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element=
          {
            <>
                <Navbar/>
                <App />
            </>
        }
        />
        <Route path="/history" element=
         {
          <>
            <Navbar/>
            <History />
          </> 
        }
        />

      </Routes>
    </Router>
  </StrictMode>,
)
