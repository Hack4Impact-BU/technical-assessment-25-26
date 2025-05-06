import { useState, useEffect } from "react";
import ToggleSwitch from "./Toggle";


type LocationPopupProps = {
  lat: number;
  lng: number;
  onClose:() => void;
};

type SunData = {
  sunrise: string;
  sunset: string;
  location: string;
  description: string;
  country_code: string;
};

export default function LocationPopup({ lat, lng, onClose }: LocationPopupProps) {
  const [viewSunrise, setViewSunrise] = useState(true);
  const [showTwin, setShowTwin] = useState(false);
  const [sunData,setSunData] = useState<SunData | null>(null);
  const [twinData,setTwinData] = useState<{
    location: string;
    sunrise: string;
    sunset: string;
    fun_fact: string;
    country_code?: string;
  } | null>(null);
  const [loadingTwin, setLoadingTwin] = useState(false);

  const saveToHistory =async (clicked: SunData,twin: typeof twinData) => {
    if (!twin) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clickedData: {
            latitude: lat,
            longitude: lng,
            sunrise: clicked.sunrise,
            sunset: clicked.sunset,
            location: clicked.location,
            description: clicked.description,
            country_code: clicked.country_code,
          },
          twinData: twin,
        }),
      });
  
      const result = await response.json();
      console.log("History saved:", result);
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  };

  useEffect(() => {
    const fetchSunData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sun`, {
          method:"POST",
          headers:{ "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng }),
        });
        const data = await response.json();
        console.log("Marked location data:", data);
        setSunData(data);
      } catch (error) {
        console.error("Error fetching sun data:", error);
      }
    };

    fetchSunData();
  }, [lat, lng]);

  useEffect(()=>{
    if (showTwin && sunData && !twinData) {
      const fetchTwinData = async () => {
        setLoadingTwin(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/twin`, {
            method:"POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sunData),
          });
          const data = await response.json();
          console.log("Twin Data (frontend):", data);
          setTwinData(data);

        await saveToHistory(sunData, data);
        } catch (err) {
          console.error("Error fetching twin data:", err);
        } finally {
          setLoadingTwin(false);
        }
      };
  
      fetchTwinData();
    }
  }, [showTwin, sunData, twinData]);

  const displayTime = (time: string) => {
    const parsedDate = new Date(time);
  
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const today = new Date().toDateString();
    const fallbackDate = new Date(`${today} ${time}`);
  
    return !isNaN(fallbackDate.getTime())
      ? fallbackDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Invalid Time";
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl text-black relative p-6 w-[70vw] h-[80vh] overflow-y-auto">
        <button className="absolute top-2 right-3 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black text-xl rounded-full transition hover:bg-gray-200 hover:shadow" onClick={onClose}>
          ✕
        </button>

          <h2 className="text-2xl font-bold mb-4">Location Data</h2>

          <div className="flex items-center gap-6 my-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium">🌅 Sunrise</span>
            <ToggleSwitch enabled={!viewSunrise}onToggle={() => setViewSunrise(!viewSunrise)} />
            <span className="font-medium">🌇 Sunset</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">📍 You</span>
            <ToggleSwitch enabled={showTwin} onToggle={() => setShowTwin(!showTwin)} />
            <span className="font-medium">🌍 Twin</span>
          </div>
        </div>
        <div className="w-full h-1 mb-2 mt-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 rounded-full shadow" />
        {sunData ? (showTwin? (loadingTwin ? (<p className="text-center text-xl text-gray-500 mt-12">Loading twin data...</p>) : twinData ? (
          <div className="mt-4 space-y-4">
            <p className="text-xl font-semibold text-gray-800 flex items-center">
              🌍 Twin Location: <span className="font-bold ml-1">{twinData.location}</span>
              {"country_code" in twinData && twinData.country_code && (
                <img
                  src={`https://flagcdn.com/24x18/${twinData.country_code.toLowerCase()}.png`}
                  alt="flag"
                  className="ml-2 w-6 h-4 rounded-sm shadow-sm object-cover"
                />
              )}
            </p>
            <p className={`${viewSunrise ? "text-yellow-500" : "text-purple-500"} text-4xl font-extrabold`}>
              {viewSunrise ? "Sunrise" : "Sunset"}:{" "}
              {displayTime(viewSunrise ? twinData.sunrise : twinData.sunset)}
            </p>
            <p className="italic text-lg text-black mt-2">💬 {twinData.fun_fact}</p>
          </div>
        ):(
          <p className="text-center text-red-500 mt-12">Twin data unavailable</p>
        )):(
        <div className="mt-4 space-y-4">
        <p className="text-xl font-semibold text-gray-800 flex items-center">
          📍 Location: <span className="font-bold ml-1">{sunData.location}</span>
          {sunData.country_code && (
            <img
              src={`https://flagcdn.com/24x18/${sunData.country_code.toLowerCase()}.png`}
              alt="flag"
              className="ml-2 w-6 h-4 rounded-sm shadow-sm object-cover"
            />
          )}
        </p>
          <p className={`${viewSunrise? "text-yellow-500" : "text-purple-500"} text-4xl font-extrabold`}>
            {viewSunrise ? "Sunrise: ":"Sunset: "}
            {displayTime(viewSunrise ?sunData.sunrise :sunData.sunset)}
          </p>
          <p className="text-black italic text-lg mt-2">💬 {sunData.description}</p>
        </div>
          )
        ):(
          <p className="text-center text-xl text-gray-500 mt-12">Loading sun data...</p>
        )}
        </div>
      </div>
    </div>
  );
}