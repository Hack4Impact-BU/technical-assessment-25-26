import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function SunPopup({ sessionId }) {
    const popupRef = useRef(null);
    const map = useMapEvents({
        click: async (e) => {
            if (popupRef.current) {
                map.closePopup(popupRef.current);
                popupRef.current = null;
                return;
            }

            const { lat, lng } = e.latlng;
            const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(
                    `<div class="font-serif text-gray-800"><em>Loading…</em></div>`
                )
                .openOn(map);
            popupRef.current = popup;

            try {
                const sunRes = await fetch(`${API_URL}/sun`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat, lon: lng }),
                });
                if (sunRes.status === 429) {
                    popup.setContent(
                        `<div class="font-serif text-gray-800">
              <em>Slow down—SolarGem can’t keep up.</em>
            </div>`
                    );
                    return;
                }
                if (!sunRes.ok) throw new Error(sunRes.statusText);

                const { sunrise, sunset, tz, location } = await sunRes.json();
                const fmt = {
                    timeZone: tz,
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZoneName: 'short',
                };
                const sr = new Date(sunrise).toLocaleTimeString('en-US', fmt);
                const ss = new Date(sunset).toLocaleTimeString('en-US', fmt);

                popup.setContent(`
          <div class="font-serif text-gray-800">
            <strong class="font-sans">📍 ${location}:</strong><br/>
            🌅 ${sr}<br/>
            🌇 ${ss}<br/>
            <em>Google Gemini is thinking…</em>
          </div>
        `);

                fetch(`${API_URL}/gemini`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat, lon: lng }),
                })
                    .then(async (res) => {
                        if (res.status === 429) {
                            popup.setContent(`
                <div class="font-serif text-gray-800">
                  <strong class="font-sans">📍 ${location}:</strong><br/>
                  🌅 ${sr}<br/>
                  🌇 ${ss}<br/>
                  <em>Slow down—SolarGem can’t keep up.</em>
                </div>
              `);
                            return null;
                        }
                        if (!res.ok) throw new Error(res.statusText);
                        return res.json();
                    })
                    .then(async (data) => {
                        if (!data) return;
                        const { name, country, sunriseLocal, sunsetLocal } = data;
                        popup.setContent(`
              <div class="font-serif text-gray-800 space-y-1">
                <strong class="font-sans">📍 ${location}:</strong><br/>
                🌅 ${sr}<br/>
                🌇 ${ss}
                <hr class="my-2 border-gray-300"/>
                <strong class="font-sans">🔭 Similar:</strong> ${name}, ${country}<br/>
                🌅 ${sunriseLocal}<br/>
                🌇 ${sunsetLocal}
              </div>
            `);
                        await fetch(`${API_URL}/history`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId, lat, lon: lng, tz }),
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        popup.setContent(`
              <div class="font-serif text-gray-800">
                <strong class="font-sans">📍 ${location}:</strong><br/>
                🌅 ${sr}<br/>
                🌇 ${ss}<br/>
                <em>Could not find similar location</em>
              </div>
            `);
                    });
            } catch (err) {
                console.error(err);
                popup.setContent(
                    `<div class="font-serif text-red-600">❌ Error fetching sun times</div>`
                );
            }
        },
    });

    return null;
}
