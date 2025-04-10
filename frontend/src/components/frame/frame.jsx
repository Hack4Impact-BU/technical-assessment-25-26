import React, { createContext, useState } from 'react'
import NavBar from "../../components/navbar/navbar";
import './frame.css'

export const ThemeContext = createContext()
export const TimeContext = createContext()

export default function Frame({ children }) {
    /* 
        Component: Frame
        Curved container that contains body content
    */
   
    const [theme, setTheme] = useState(true);
    const [timeZone, setTimeZone] = useState("America/New_York");

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