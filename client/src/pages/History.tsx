import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type HistoryItem = {
  _id: string;
  clicked: {
    latitude: number;
    longitude: number;
    location: string;
    description: string;
    country_code?: string;
  };
  twin: {
    location: string;
    sunrise: string;
    sunset: string;
    fun_fact: string;
    country_code?: string;
    summaryLocation?: string;
  };
};

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/history");
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

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16">
        <Navbar />
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-center">📖 History</h1>

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
                <p className="text-sm text-gray-500">
                  Lat: {entry.clicked.latitude}, Lng: {entry.clicked.longitude}
                </p>
                <p className="text-gray-700 mt-2 italic">{entry.clicked.description}</p>

                <hr className="my-4" />

                <h2 className="text-xl font-semibold text-gray-800">🌍 Twin Location: {entry.twin.location}</h2>
                <p className="text-sm text-gray-500">
                  🕒 Sunrise: {entry.twin.sunrise} | 🌇 Sunset: {entry.twin.sunset}
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
