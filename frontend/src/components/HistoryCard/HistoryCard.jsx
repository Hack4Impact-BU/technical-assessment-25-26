import React from "react";

export default function HistoryCard({
  name,
  latitude,
  longitude,
  sunriseTime,
  sunsetTime,
  createdAt,
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-lg w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <div className="text-base text-gray-700 mb-2">
        <strong>Coords:</strong> {latitude}, {longitude}
      </div>
      <div className="text-base text-gray-700">
        <strong>Sunrise – Sunset:</strong> {sunriseTime} – {sunsetTime}
      </div>
    </div>
  );
}
