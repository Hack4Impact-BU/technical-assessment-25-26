import React from 'react'
import Home from './home.jsx'
import History from '../../page2/history'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Sets up the router for the app
function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </Router>
        </>
    )
}
export default App