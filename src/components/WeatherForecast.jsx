import { useState, useEffect, useRef, useMemo } from "react";
import { OPEN_WEATHER_API_KEY } from "../config";
import { MdOutlineAccessTime, MdWaterDrop } from "react-icons/md";
import PropTypes from "prop-types";

const WeatherForecast = ({ city }) => {
  const [rawForecast, setRawForecast] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const forecastContainerRef = useRef(null);

  useEffect(() => {
    const fetchHourlyWeather = async () => {
      if (!OPEN_WEATHER_API_KEY || !city) return;

      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRawForecast(data.list || []);
      } catch (error) {
        console.error("Error fetching hourly weather data:", error);
      }
    };

    fetchHourlyWeather();
  }, [city]);

  const hourlyOutlook = useMemo(() => {
    if (rawForecast.length === 0) return [];

    const result = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const targetTime = new Date(now.getTime() + i * 60 * 60 * 1000);

      const nextIndex = rawForecast.findIndex(
        (b) => b.dt * 1000 > targetTime.getTime()
      );

      const prevBlock = rawForecast[nextIndex - 1] || rawForecast[0];
      const nextBlock = rawForecast[nextIndex] || rawForecast[0];

      const weight =
        (targetTime.getTime() - prevBlock.dt * 1000) /
        ((nextBlock.dt - prevBlock.dt) * 1000 || 1);

      const interpolatedTemp =
        prevBlock.main.temp +
        (nextBlock.main.temp - prevBlock.main.temp) * weight;

      result.push({
        time: targetTime,
        temperature: Math.round(interpolatedTemp),
        humidity: prevBlock.main.humidity,
        weatherDescription: prevBlock.weather[0].description,
        icon: prevBlock.weather[0].icon,
      });
    }

    return result;
  }, [rawForecast]);

  return (
    <div className="w-full p-6 card rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-500">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MdOutlineAccessTime className="text-blue-500" />
          Hourly Outlook
        </h3>
        <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest animate-pulse">
          Swipe →
        </span>
      </div>

      <div
        ref={forecastContainerRef}
        className="overflow-x-auto pb-2 flex items-stretch scrollbar-hide snap-x snap-mandatory"
      >
        {hourlyOutlook.map((weather, index) => (
          <div
            key={index}
            onClick={() => setSelectedWeather(weather)}
            className="snap-center flex-shrink-0 w-[100px] flex flex-col items-center py-4 px-2 hover:bg-current/5 cursor-pointer border-r border-current/5 last:border-r-0 transition-colors"
          >
            <span className="text-[11px] font-bold opacity-50 mb-3">
              {index === 0
                ? "NOW"
                : weather.time.toLocaleTimeString([], {
                    hour: "numeric",
                    hour12: true,
                  })}
            </span>

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
              alt="weather"
              className="w-10 h-10 mb-2 filter drop-shadow-md"
            />

            <span className="text-xl font-black mb-2">
              {weather.temperature}°
            </span>

            <div className="flex items-center gap-0.5 text-[9px] text-blue-500 font-black">
              <MdWaterDrop size={10} />
              {weather.humidity}%
            </div>
          </div>
        ))}
      </div>

      {selectedWeather && (
        <div className="mt-6 p-4 bg-current/5 border border-current/10 rounded-3xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <div>
            <p className="text-[10px] opacity-50 font-black uppercase">
              Forecast Details
            </p>
            <p className="text-sm font-bold text-blue-500">
              {selectedWeather.weatherDescription}
            </p>
          </div>
          <button
            onClick={() => setSelectedWeather(null)}
            className="text-xs opacity-50 hover:opacity-100 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

WeatherForecast.propTypes = {
  city: PropTypes.string.isRequired,
};

export default WeatherForecast;