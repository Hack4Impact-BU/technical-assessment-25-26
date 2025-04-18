import React, { useState, useEffect } from "react";
import HistoryCard from "../components/HistoryCard/HistoryCard";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/history")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history entries:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading search history…</p>;
  }

  if (entries.length === 0) {
    return <p>No history yet.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search History</h1>

      {entries.map((item) => (
        <HistoryCard
          key={item._id}
          name={item.name}
          latitude={item.latitude}
          longitude={item.longitude}
          sunriseTime={item.sunriseTime}
          sunsetTime={item.sunsetTime}
          createdAt={item.createdAt}
        />
      ))}
    </div>
  );
}
