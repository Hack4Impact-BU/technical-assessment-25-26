import { useState, useEffect } from "react";
import Map from "../components/Map";
import Navbar from "../components/Navbar";

export default function Home() {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos)=> {
                const {latitude, longitude} = pos.coords;
                setPosition([latitude, longitude]);
            },
            (error) =>{
                alert("Unable to retrieve your location. Please enable location services and try again.");
                console.log(error);
            }
        )
    }, [])

    return (
      <div className="h-[calc(100vh-64px)]">
        <Navbar />
        <div className="h-[90vh] w-full">
            <Map position={position} />
        </div>
      </div>
    );
  }