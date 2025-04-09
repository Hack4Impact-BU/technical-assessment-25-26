import React, { createContext, useState } from 'react'
import NavBar from "../../components/navbar/navbar";
import './frame.css'

export const ThemeContext = createContext()

export default function Frame({ children }) {
    /* 
        Component: Frame
        Curved container that contains body content
    */
   
    const [theme, setTheme] = useState(false);

    return (
        <div className="app-bg">
            <div className="app-shell">
                <ThemeContext.Provider value={[theme, setTheme]}>
                <NavBar />
                {children}
                </ThemeContext.Provider>
            </div>
        </div>
    );
}