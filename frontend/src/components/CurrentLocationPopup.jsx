import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function CurrentLocationMarker({ lat, lon, sessionId }) {
    const map = useMap();
    const inFlight = useRef(false);

    const showPopup = async () => {
        if (inFlight.current) return;
        inFlight.current = true;

        const popup = L.popup({ offset: [0, -20] })
            .setLatLng([lat, lon])
            .setContent('<em>Loading…</em>')
            .openOn(map);

        try {
            const sunRes = await fetch(`${API_URL}/sun`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lon }),
            });
            if (sunRes.status === 429) {
                popup.setContent("Slow down—SolarGem can’t keep up.");
                return;
            }
            if (!sunRes.ok) throw new Error(sunRes.statusText);
            const { sunrise, sunset, tz, location } = await sunRes.json();

            const fmt = { timeZone: tz, hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
            const sr = new Date(sunrise).toLocaleTimeString('en-US', fmt);
            const ss = new Date(sunset).toLocaleTimeString('en-US', fmt);

            popup.setContent(`
        <div style="line-height:1.4">
          <strong>📍 ${location} (You) </strong><br/>
          🌅 ${sr}<br/>
          🌇 ${ss}<br/>
          <em>Google Gemini is thinking…</em>
        </div>
      `);

            const gemRes = await fetch(`${API_URL}/gemini`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lon }),
            });
            if (gemRes.status === 429) {
                popup.setContent(`
          <div style="line-height:1.4">
            <strong>📍 ${location} (You) </strong><br/>
            🌅 ${sr}<br/>
            🌇 ${ss}<br/>
            <em>Slow down—SolarGem can’t keep up.</em>
          </div>
        `);
                return;
            }
            if (!gemRes.ok) throw new Error(gemRes.statusText);
            const { name, country, sunriseLocal, sunsetLocal } = await gemRes.json();

            popup.setContent(`
        <div style="line-height:1.4">
          <strong>📍 ${location} (You) </strong><br/>
          🌅 ${sr}<br/>
          🌇 ${ss}
          <hr style="margin:8px 0"/>
          <strong>🔭 Similar:</strong> ${name}, ${country}<br/>
          🌅 ${sunriseLocal}<br/>
          🌇 ${sunsetLocal}
        </div>
      `);


        } catch (err) {
            console.error(err);
            popup.setContent('❌ Error fetching sun times');
        } finally {
            inFlight.current = false;
        }
    };

    useEffect(() => {
        showPopup();
    }, []); 

    return (
        <Marker
            position={[lat, lon]}
            eventHandlers={{
                click: () => {
                    showPopup();
                },
            }}
        />
    );
}
