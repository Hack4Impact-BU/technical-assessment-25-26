import React from "react";
import "./title.css";

export default function Title() {
    /* 
        Component: Title
        App name + Animations and Design
    */
   
    return (
        <div className="title" onClick={() => window.open('/', '_self')}>
            <h1 className="sun-globe-text">
                SunGl
                <span className="globe-icon">
                    <div className="sunrise-container">
                        <div className="sun"></div>
                        <svg viewBox="0 0 24 24" className="globe-svg" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" className="globe-circle" />
                            <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="#fff" strokeWidth="1" fill="none"/>
                        </svg>
                    </div>
                </span>
                be
            </h1>
        </div>
    );
}
