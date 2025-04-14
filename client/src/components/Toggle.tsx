type ToggleSwitchProps = {
    enabled: boolean;
    onToggle: () => void;
  };

export default function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
    return (
      <div
        onClick={onToggle}
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition duration-300 ${
          enabled ? 'bg-yellow-400' : 'bg-purple-500'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-6' : ''
          }`}
        />
      </div>
    );
  }