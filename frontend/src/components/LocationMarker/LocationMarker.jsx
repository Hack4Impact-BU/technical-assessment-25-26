import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { getSunrise, getSunset } from "sunrise-sunset-js";

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

  useEffect(() => {
    if (!position) return;

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError("");

        const srDate = await getSunrise(position.lat, position.lng);
        const ssDate = await getSunset(position.lat, position.lng);

        const formattedSunrise = formatTime(srDate);
        const formattedSunset = formatTime(ssDate);

        setSunrise(formattedSunrise);
        setSunset(formattedSunset);

        const response = await fetch(`https://intense-fortress-30537-ba108689e738.herokuapp.com/api/gemini`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalLocation: position,
            originalSunrise: formattedSunrise,
            originalSunset: formattedSunset,
          }),
        });

        if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSimilar(data);
      } catch (error) {
        console.error("Gemini request failed:", error);
        setError(error.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [position]);

  useMapEvents({
    click() {
      this.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      this.flyTo(e.latlng, this.getZoom());
    },
  });

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup minWidth={240}>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Coordinates:</strong> {position.lat},{" "}
            {position.lng}
          </div>
          <div>
            <strong>Sunrise:</strong> {sunrise || "…"}
          </div>
          <div>
            <strong>Sunset:</strong> {sunset || "…"}
          </div>

          {loading && <div className="italic">Finding similar place…</div>}
          {error && <div className="text-red-500">Error: {error}</div>}

          {similar && !loading && !error && (
            <div className="border-t pt-2">
              <strong>Similar Place:</strong>
              <div>{similar.name}</div>
              <div>
                {similar.latitude}, {similar.longitude}
              </div>
              <div>
                {similar.sunriseTime} – {similar.sunsetTime}
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker;
