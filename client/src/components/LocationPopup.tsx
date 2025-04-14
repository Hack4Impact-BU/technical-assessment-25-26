import { useState } from "react"; 
import ToggleSwitch from "./toggle";

type LocationPopupProps = {
    lat: number;
    lng: number;
    onClose: () => void;
  };
  
export default function LocationPopup({ onClose }: LocationPopupProps) {
  const [viewSunrise, setViewSunrise] = useState(true);
  const [showTwin, setShowTwin] = useState(false);
    return (
<div className="transition-all duration-300 ease-in-out">
  <div className="fixed inset-0 z-[999] flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl text-black relative p-6 w-[70vw] h-[80vh] overflow-y-auto">
      <button
        className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        onClick={onClose}
      >
        ✕
      </button>
  
      <h2 className="text-2xl font-bold mb-4">Sun Data</h2>
      <div className="flex items-center gap-6 my-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-medium">🌅 Sunrise</span>
          <ToggleSwitch enabled={viewSunrise} onToggle={() => setViewSunrise(!viewSunrise)} />
          <span className="font-medium">🌇 Sunset</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">🌍 Twin</span>
          <ToggleSwitch enabled={showTwin} onToggle={() => setShowTwin(!showTwin)} />
        </div>
      </div>
      {showTwin ? (
        viewSunrise ? (
          <div className="text-yellow-600">🌍 Twin Sunrise Time: 6:12 AM</div>
        ) : (
          <div className="text-purple-600">🌍 Twin Sunset Time: 7:40 PM</div>
        )
      ) : (
        viewSunrise ? (
          <div className="text-yellow-600">📍 Your Sunrise Time: 6:15 AM</div>
        ) : (
          <div className="text-purple-600">📍 Your Sunset Time: 7:42 PM</div>
        )
      )}
    </div>
  </div>
</div>
    );
  }