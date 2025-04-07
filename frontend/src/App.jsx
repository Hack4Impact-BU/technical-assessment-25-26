import React from 'react'
import Map from "./components/map/map";
import Frame from "./components/frame/frame";
import './App.css'

function App() {
  return (
    <Frame>
      <div className="map-wrapper">
        <Map />
      </div>
    </Frame>
  )
}

export default App
