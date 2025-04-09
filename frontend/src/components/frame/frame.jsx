import React, { createContext, useState } from 'react'
import NavBar from "../../components/navbar/navbar";
import './frame.css'

export const ThemeContext = createContext()

export default function Frame({ children }) {
    /* 
        Component: Frame
        Curved container that contains body content
    */
   
    const [theme, setTheme] = useState(true);

    return (
        <div className={`app-bg ${!theme ? "light-app-bg" : ""}`}>
            <div className={`app-shell ${!theme ? "light-app-shell" : ""}`}>
                <ThemeContext.Provider value={[theme, setTheme]}>
                <NavBar />
                {children}
                </ThemeContext.Provider>
            </div>
        </div>
    );
}