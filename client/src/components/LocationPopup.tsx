import { useState, useEffect } from "react"; 
import ToggleSwitch from "./toggle";


type LocationPopupProps = {
    lat: number;
    lng: number;
    onClose: () => void;
  };
  
export default function LocationPopup({ lat, lng, onClose }: LocationPopupProps) {
  const [viewSunrise, setViewSunrise]= useState(true);
  const [showTwin, setShowTwin]= useState(false);
  const [sunData, setSunData]= useState<{ sunrise: string; sunset: string } | null>(null);
  useEffect(() =>{
    const fetchSunData=async ()=> {
      try {
        const response= await fetch("http://localhost:3001/api/sun", {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body: JSON.stringify({ lat, lng }),
        });
        const data=await response.json();
        setSunData(data);
        console.log("Data",data);
      } catch (error){
        console.error("Error fetching sun data:", error);
      }
    };
  
    fetchSunData();
  }, [lat, lng]);
  useEffect(() => {
    if (showTwin && sunData) {
      const fetchTwinData = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/twin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sunData),
          });
          const data = await response.json();
          console.log("Twin data:", data);
        } catch (err) {
          console.error("Error:", err);
        }
      };
  
      fetchTwinData();
    }
  }, [showTwin, sunData]);
    return (
<div className="transition-all duration-300 ease-in-out">
  <div className="fixed inset-0 z-[999] flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl text-black relative p-6 w-[70vw] h-[80vh] overflow-y-auto">
      <button
        className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        onClick={onClose}
      >
        ✕
      </button>
  
      <h2 className="text-2xl font-bold mb-4">Sun Data</h2>
      <div className="flex items-center gap-6 my-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-medium">🌅 Sunrise</span>
          <ToggleSwitch enabled={viewSunrise} onToggle={() => setViewSunrise(!viewSunrise)} />
          <span className="font-medium">🌇 Sunset</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">🌍 Twin</span>
          <ToggleSwitch enabled={showTwin} onToggle={() => setShowTwin(!showTwin)} />
        </div>
      </div>
      {sunData ? (
        showTwin ? (
          <p>Twin data</p>
        ) : viewSunrise ? (
          <p className="text-yellow-600">
            📍 Sunrise: {new Date(sunData.sunrise).toLocaleTimeString()}
          </p>
        ) : (
          <p className="text-purple-600">
            📍 Sunset: {new Date(sunData.sunset).toLocaleTimeString()}
          </p>
        )
      ) : (
        <p>Loading sun data...</p>
      )}
    </div>
  </div>
</div>
    );
  }