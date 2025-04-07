import React from 'react'
import NavBar from "../../components/navbar/navbar";
import './frame.css'

export default function Frame({ children }) {
    return (
        <div className="app-bg">
            <div className="app-shell">
                <NavBar />
                {children}
            </div>
        </div>
    );
}