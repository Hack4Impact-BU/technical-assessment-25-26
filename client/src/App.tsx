import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'
import { Analytics } from "@vercel/analytics/react"

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
