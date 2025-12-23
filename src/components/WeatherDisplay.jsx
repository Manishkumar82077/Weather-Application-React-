 import PropTypes from "prop-types";

const WeatherDisplay = ({ currentTime, temperature }) => {
  // Safety check to prevent .toLocaleTimeString() from crashing if data is missing
  if (!currentTime) return null;

  return (
    <div className="flex justify-center my-6">
      <div className="flex-shrink-0 border border-[#2a2a2a] rounded-2xl p-6 w-56 bg-[#121212] shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:border-blue-500/50 group">
        <p className="text-xl font-bold mb-1 text-white">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-semibold">
          {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
            {temperature !== undefined ? `${Math.round(temperature)}°` : "---"}
          </p>
          <span className="text-lg text-gray-500 pb-1 font-medium">Celsius</span>
        </div>
      </div>
    </div>
  );
};

// Solving the ESLint prop-types issues
WeatherDisplay.propTypes = {
  currentTime: PropTypes.instanceOf(Date).isRequired,
  temperature: PropTypes.number,
};

export default WeatherDisplay;