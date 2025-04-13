type LocationPopupProps = {
    lat: number;
    lng: number;
    onClose: () => void;
  };
  
export default function LocationPopup({ lat, lng, onClose }: LocationPopupProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[999] bg-transparent" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-xl text-black relative p-6 transition-all duration-300 pointer-events-auto" style={{width: "70vw",height: "80vh",}}>
          <button className="absolute top-2 right-3 text-gray-600 hover:text-black" onClick={(e) => {e.stopPropagation(); onClose();}}>
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4">Sun Data</h2>
          <p>📍 Lat: {lat.toFixed(2)}</p>
          <p>📍 Lng: {lng.toFixed(2)}</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"onClick={(e) => e.stopPropagation()}>
            Fetch Sunrise/Sunset
          </button>
        </div>
      </div>
    );
  }