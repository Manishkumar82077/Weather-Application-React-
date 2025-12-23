import React, { useState, useEffect, useRef } from "react";
import WeatherDisplay from "./WeatherDisplay";
import { OPEN_WEATHER_API_KEY } from "../config";

const WeatherForecast = ({ city }) => {
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const forecastContainerRef = useRef(null);

  useEffect(() => {
    const fetchHourlyWeather = async () => {
      if (!OPEN_WEATHER_API_KEY) return;
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const next24Hours = data.list.slice(0, 8);

        const formattedData = next24Hours.map((item) => ({
          time: new Date(item.dt * 1000),
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          weatherDescription: item.weather[0].description,
        }));

        setHourlyWeather(formattedData);
      } catch (error) {
        console.error("Error fetching hourly weather data:", error);
      }
    };

    fetchHourlyWeather();
  }, [city]);

  const scrollLeft = () => {
    if (forecastContainerRef.current) {
      forecastContainerRef.current.scrollLeft -= 250;
    }
  };

  const scrollRight = () => {
    if (forecastContainerRef.current) {
      forecastContainerRef.current.scrollLeft += 250;
    }
  };

  const handleWeatherClick = (weather) => {
    setSelectedWeather(weather);
  };

  const closePopup = () => {
    setSelectedWeather(null);
  };

  return (
    <div className="max-w-full p-5 mt-5 relative bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Next 24 hours</p>
          <h3 className="text-lg font-semibold text-white">Hourly outlook</h3>
        </div>
      </div>
      {hourlyWeather.length > 0 && (
        <div className="w-full mb-4 grid gap-3 md:grid-cols-2 text-left">
          {hourlyWeather.slice(0, 2).map((weather, idx) => (
            <div
              key={`mini-${idx}`}
              className="bg-[#121212] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-400">
                  {weather.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>
                <p className="text-lg font-semibold text-white capitalize">
                  {weather.weatherDescription}
                </p>
                <p className="text-sm text-gray-300">
                  Humidity {weather.humidity}% · Wind {weather.windSpeed} m/s
                </p>
              </div>
              <div className="text-3xl font-bold text-white">
                {weather.temperature}°C
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        ref={forecastContainerRef}
        className="overflow-x-auto scrollbar-hide whitespace-nowrap flex flex-row items-center relative snap-x"
      >
        {hourlyWeather.map((weather, index) => (
          <div
            key={index}
            className="snap-start inline-block w-60 md:w-64 h-52 m-2.5 cursor-pointer transform transition-transform duration-200 bg-[#121212] border border-[#2a2a2a] rounded-xl shadow-sm hover:border-gray-500"
            onClick={() => handleWeatherClick(weather)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="p-4 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between text-sm text-gray-300">
                <span>{weather.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                <span className="text-gray-400">{weather.weatherDescription}</span>
              </div>
              <div className="text-4xl font-bold text-white">{weather.temperature}°C</div>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Humidity {weather.humidity}%</span>
                <span>Wind {weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedWeather && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#121212] border border-[#2a2a2a] p-7 rounded-xl shadow-lg z-20 w-4/5 max-w-lg text-center transition-opacity duration-300 opacity-100">
          <h3 className="mb-5 text-white text-2xl font-semibold">
            Weather Details
          </h3>
          <p className="mb-3 text-lg text-gray-200">
            <strong>Time:</strong> {selectedWeather.time.toLocaleString()}
          </p>
          <p className="mb-3 text-lg text-gray-200">
            <strong>Temperature:</strong> {selectedWeather.temperature}°C
          </p>
          <p className="mb-3 text-lg text-gray-200">
            <strong>Humidity:</strong> {selectedWeather.humidity}%
          </p>
          <p className="mb-3 text-lg text-gray-200">
            <strong>Wind Speed:</strong> {selectedWeather.windSpeed} m/s
          </p>
          <p className="mb-6 text-lg text-gray-200">
            <strong>Description:</strong> {selectedWeather.weatherDescription}
          </p>
          <button
            onClick={closePopup}
            className="px-6 py-3 bg-white text-black border border-[#2a2a2a] rounded-lg cursor-pointer text-lg shadow-md transition-all duration-300 hover:bg-[#f5f5f5]"
          >
            Close
          </button>
        </div>
      )}

      {selectedWeather && (
        <div
          onClick={closePopup}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"
        />
      )}
    </div>
  );
};

export default WeatherForecast;

// import React, { useState, useEffect } from "react";
// import WeatherDisplay from "./WeatherDisplay";

// const WeatherForecast = ({ city }) => {
//   const [hourlyWeather, setHourlyWeather] = useState([]);

//   useEffect(() => {
//     const fetchHourlyWeather = async () => {
//       const apiKey = "da13201d36831242cbc1d64dc1fa4c04";
//       const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

//       try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         // Extract hourly data for the next 24 hours (assuming data.list is an array of hourly forecasts)
//         const next24Hours = data.list.slice(0, 8); // Adjust slice based on data structure

//         // Map to keep only required properties (time, temperature)
//         const formattedData = next24Hours.map((item) => ({
//           time: new Date(item.dt * 1000), // Convert Unix timestamp to JS date object
//           temperature: item.main.temp,
//         }));

//         setHourlyWeather(formattedData);
//       } catch (error) {
//         console.error("Error fetching hourly weather data:", error);
//       }
//     };

//     fetchHourlyWeather();
//   }, [city]);

//   return (
//     <div
//       style={{
//         overflowX: "auto",
//         whiteSpace: "nowrap",
//         maxWidth: "100%",
//         padding: "20px",
//         marginTop: "20px",
//       }}
//     >
//       {hourlyWeather.map((weather, index) => (
//         <div
//           key={index}
//           style={{ display: "inline-block", width: "250px", margin: "0 10px" }}
//         >
//           <WeatherDisplay
//             currentTime={weather.time}
//             temperature={weather.temperature}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WeatherForecast;
