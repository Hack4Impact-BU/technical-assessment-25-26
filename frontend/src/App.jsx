import Tabs from './components/tabs/Tabs';
import './App.css';

function App() {
  return (
      <div className="page_container">
        <div className="title_container">
          Skipper's Voyage
          <img src="../compass.png" alt="compass" className="compass_img" />
        </div>
        <div className="body_container">
          <Tabs />
        </div>
      </div>
  )
}

export default App
