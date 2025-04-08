import React from 'react'
import Map from "./components/map/map";
import Frame from "./components/frame/frame";
import './App.css'

function App() {
  /* 
        Route (Page): /
        Component: App
        Surves the homepage of the app, and retreives and displays map.
    */

  return (
    <Frame>
      <div className="map-wrapper">
        <Map />
      </div>
    </Frame>
  )
}

export default App
