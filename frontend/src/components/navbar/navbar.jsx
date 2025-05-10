import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import homeIcon from '../../assets/home2.png';
import logsIcon from '../../assets/folder2.png';
import Logo from '../../assets/logo3.png';
import darkIcon from '../../assets/moon2.png';

function Navbar() {
    
    return (
        <div id="navbar">
            <img src={ Logo } alt="logo" width="60px" height="auto" id="logoimg"/>
            <Link to= "/">
                <button>
                    <img src={homeIcon} alt="home" width="35px" height="35px"/>
                </button>
            </Link>
            <Link to= "/logs">
                <button>
                    <img src={logsIcon} alt="logs" width="30px" height="30px"/>
                </button>
            </Link>
            <button onClick={() => document.body.classList.toggle("dark-mode")}>
                <img src={ darkIcon } width="45px" height="45px" alt="darkmode"></img>
            </button>
        </div>
    )
}

export default Navbar