import React from "react";
import "./navbar.css";
import Title from '../../components/title/title'
import { Moon } from 'lucide-react';

export default function NavBar() {
    return (
        <div className="nav-bar">
            <div className="nav-left">
                <Title />
            </div>
            <div className="nav-right">
                <a href="/history">History</a>
                <button className="dark-toggle" aria-label="Toggle dark mode">
                    <Moon color="white" size={30} />
                </button>
            </div>
        </div>
    );
}