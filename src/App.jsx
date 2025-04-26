import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/navbar/navbar';
import Map from './components/map/map';
import History from './components/history/history'; 
import './App.css';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/Map" element={<Map />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App
