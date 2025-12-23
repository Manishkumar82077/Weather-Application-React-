 import PropTypes from 'prop-types';

const DailyWeatherCard = ({ date, temperature, weather, icon }) => {
  return (
    <div className="transition-transform duration-300 hover:scale-105 m-4 p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-xl shadow-md text-center text-white">
      <img
        // 1. Switched to HTTPS to prevent mixed content security errors
        // 2. Used @2x for better image quality on high-res screens
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather} // Better accessibility than "Weather Icon"
        className="mx-auto w-16 h-16"
      />
      <h2 className="text-lg font-semibold">
        {/* Added check to ensure date exists before calling toLocaleDateString */}
        {date instanceof Date ? date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A'}
      </h2>
      <p className="text-gray-400 capitalize">{weather}</p>
      <p className="text-2xl font-bold mt-2">{Math.round(temperature)} °C</p>
    </div>
  );
};

// 3. Solves the "missing in props validation" ESLint error
DailyWeatherCard.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  temperature: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  weather: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default DailyWeatherCard;