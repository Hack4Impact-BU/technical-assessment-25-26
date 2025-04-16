import React, { useState, useEffect } from 'react';
import NavBar from "../../components/navbar/navbar";
import './frame.css';
import { ThemeContext, TimeContext } from './contexts';

export default function Frame({ children }) {
     /* 
        Component: Frame
        Curved container that contains body content
    */

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme !== null ? JSON.parse(savedTheme) : false;
    });

    const [timeZone, setTimeZone] = useState(() => {
        const savedTimeZone = localStorage.getItem("timeZone");
        return savedTimeZone || "America/New_York";
    });
    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("timeZone", timeZone);
    }, [timeZone]);

    return (
        <div className={`app-bg ${!theme ? "light-app-bg" : ""}`}>
            <div className={`app-shell ${!theme ? "light-app-shell" : ""}`}>
                <ThemeContext.Provider value={[theme, setTheme]}>
                    <TimeContext.Provider value={[timeZone, setTimeZone]}>
                        <NavBar />
                        {children}
                    </TimeContext.Provider>
                </ThemeContext.Provider>
            </div>
        </div>
    );
}