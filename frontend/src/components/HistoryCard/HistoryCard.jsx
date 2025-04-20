import React from "react";

export default function HistoryCard({ latitude, longitude, geminiResponse }) {
  return (
    <div className="max-w-md rounded-2xl shadow-md p-4 bg-white">
      <h2 className="text-xl font-semibold mb-2">History Entry</h2>
      <div className="space-y-1">
        <p>
          <span className="font-medium">Latitude:</span> {latitude}
        </p>
        <p>
          <span className="font-medium">Longitude:</span> {longitude}
        </p>
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2">Gemini Response</h3>
      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-lg">
        {typeof geminiResponse === "string"
          ? geminiResponse
          : JSON.stringify(geminiResponse, null, 2)}
      </pre>
    </div>
  );
}
