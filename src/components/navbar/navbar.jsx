import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  return (
    <div id="navbar">
      <h1>ChronoZone</h1>
      <Link to="/Map" href="#Map">Map</Link>
      <Link to="/History" href="#History">History</Link>
    </div>
  );
}

export default Navbar;