import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type History = {
  _id: string;
  clicked: {
    latitude: number;
    longitude: number;
    location: string;
    description: string;
    country_code?: string;
    sunrise: string;
    sunset: string;
  };
  twin: {
    latitude: number;
    longitude: number;
    location: string;
    sunrise: string;
    sunset: string;
    fun_fact: string;
    country_code?: string;
  };
  timestamp: string; // ← add this
};

export default function History() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("❌ Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  function formatTime(timeStr: string | undefined | null) {
    if (!timeStr) return "N/A";
  
    // If it's already formatted like "6:06 AM", just return it
    if (!timeStr.includes("T")) return timeStr;
  
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return "N/A";
  
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16">
        <Navbar />
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        <span className="mr-2">📖</span>History Log
      </h1>
      <p className="text-center text-gray-500 mb-6 text-sm italic">
        A timeline of all your sun-chasing adventures 🌅
      </p>

        {loading ? (
          <p className="text-center text-gray-600">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600">No history found yet.</p>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => (
            <div key={entry._id} className="border rounded-lg p-4 shadow bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                📍 Clicked Location: {entry.clicked.location}
              </h2>
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 mt-1">
                <p className="text-gray-400 ml-2">
                  Coordinates: {entry.clicked.latitude.toFixed(4)}, {entry.clicked.longitude.toFixed(4)}
                </p>
                <span className="italic">
                  Visited on {formatDate(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-1 mt-1">
                🕒 Sunrise: {formatTime(entry.clicked.sunrise)} | 🌇 Sunset: {formatTime(entry.clicked.sunset)}
              </p>
              <p className="text-gray-700 mt-2 italic">{entry.clicked.description}</p>

              <hr className="my-4" />

              <h2 className="text-xl font-semibold text-gray-800">
                🌍 Twin Location: {entry.twin.location}
              </h2>
              <p className="text-sm text-gray-500 ml-1 mt-1">
                🕒 Sunrise: {formatTime(entry.twin.sunrise)} | 🌇 Sunset: {formatTime(entry.twin.sunset)}
              </p>
              <p className="text-gray-700 mt-2 italic">{entry.twin.fun_fact}</p>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
