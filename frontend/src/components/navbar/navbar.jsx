import React, { useState,  useContext } from 'react'
import { ThemeContext } from '../frame/frame'
import "./navbar.css";
import Title from '../../components/title/title'
import { Moon } from 'lucide-react';
import { useLocation } from "react-router-dom";



export default function NavBar() {
  /* 
      Component: NavBar
      Navigation bar at the top of frame.
      Includes the Title component, navigation links, and dark mode toggler.
  */
  //const [theme, setTheme] = useState(true); //TODO: Make this work in a context that updates all component styles.
  const [theme, setTheme] = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(prev => !prev);
  };

  const location = useLocation();

  const clearHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/history/clear", { method: "POST" });
      if (response.ok) {
        const result = await response.json();
        console.log("History cleared:", result);

        window.location.reload();

      } else {
        console.error("Failed to clear history");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className={`nav-bar ${!theme ? "light-nav-bar" : ""}`}>
      <div className="nav-left">
        <Title />
      </div>
      <div className="nav-right">
        {location.pathname === "/history" ? (
          <button className="clear-history-button" onClick={clearHistory}>
            Clear History
          </button>
        ) : (
          <a href="/history" style={{ color: theme ? 'white' : 'black' }}>History</a>
        )}
        <button className="dark-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
          <Moon color={theme ? "white" : "black"} size={30} />
        </button>
      </div>
    </div>
  );
}