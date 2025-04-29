import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export default function APIData({ lat, lng }) {
    const [data, setData] = useState(null);
    const [geminiLocation, setGeminiLocation] = useState(null);
    const map = useMap();

    useEffect(() => {
        async function getData() {
            const sunRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lat: lat,
                    lng: lng,
                })
            });
            const json = await sunRes.json();
            setData(json);

            const gemRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gemini`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lat: lat,
                    lng: lng,
                })
            });
            const gemJson = await gemRes.json();
            setGeminiLocation(gemJson.message);
        }

        getData();
    }, [lat, lng, map]);

    useEffect(() => {
      if (!data || !map) return;
      // give React one tick to render markers/popups
      requestAnimationFrame(() => {
        map.eachLayer((layer) => {
          if (layer.getPopup && layer.getPopup()) {
            layer.getPopup().update();
          }
        });
      });
    }, [data, map]);

return (
    <div className="">
        {data ? (
            <div>
                <p className="text-lg font-semibold text-[#FFB487]">🌅 Sunrise: {data.sunrise}</p>
                <p className="text-lg font-semibold text-[#415777]">🌇 Sunset: {data.sunset}</p>
                <p className="text-base fron-semibold text-green-700">🌍 Closest Match: {geminiLocation}</p>
            </div>
        ) : (
            <p className="text-gray-500">Loading...</p>
        )}
    </div>
);
}
