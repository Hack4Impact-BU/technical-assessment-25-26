import { React } from 'react';
import TabArea from './components/tabs/Tabs';
import Map from './components/map/Map';
import './App.css';

function App() {
  return (
    <div className="page_container">
      <div className="title_container">
        Seadog's Compass
        <img src="../../../public/compass.png" alt="compass" className="compass_img" />
      </div>
      <div className="body_container">
        <TabArea />
      </div>
    </div>
  )
}

export default App
