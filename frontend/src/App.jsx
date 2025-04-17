import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MapPage from "./pages/MapPage";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="flex justify-center items-center p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
