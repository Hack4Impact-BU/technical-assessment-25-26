type LocationPopupProps = {
    lat: number,
    lng: number,
}

export default function LocationPopup ({lat, lng}: LocationPopupProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md text-black w-64">
        <h2 className="font-bold mb-2">Sunrise & Sunset</h2>
        <p>📍 Lat: {lat.toFixed(2)}</p>
        <p>📍 Lng: {lng.toFixed(2)}</p>
        <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded">
          Fetch Times
        </button>
      </div>
    )
}