import React from "react";
import "./navbar.css";
import Title from '../../components/title/title'

export default function NavBar() {
    return (
        <div className="nav-bar">
            <div className="nav-left">
                <Title />
            </div>
            <div className="nav-right">
                <a href="/history">History</a>
                <button className="dark-toggle" aria-label="Toggle dark mode">🌙</button>
            </div>
        </div>
    );
}