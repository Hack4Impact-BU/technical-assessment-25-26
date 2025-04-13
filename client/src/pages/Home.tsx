import Map from "../components/Map";

export default function Home() {
    return (
      <div className="h-[calc(100vh-64px)]">
        <div className="h-[90vh] w-full">
            <Map />
        </div>
      </div>
    );
  }