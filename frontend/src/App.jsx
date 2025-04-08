import Map from "./components/Map";

function App() {
  return (
    <div className="App">
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold">
          SunSpot
        </h1>
      </header>
      <div className="flex justify-center items-center">
        <Map />
      </div>
    </div>
  );
}

export default App
