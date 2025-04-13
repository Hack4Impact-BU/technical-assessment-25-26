import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'

function App() {

  return (
    <>
      <h1 className = "text3xl font-bold text-red-500">Hello, Tailwind Check</h1>
      <Router>
      <Navbar />

      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
