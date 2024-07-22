import React, { useState, useEffect, useRef } from "react";
import WeatherDisplay from "./WeatherDisplay";

const WeatherForecast = ({ city }) => {
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [showOverflow, setShowOverflow] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const forecastContainerRef = useRef(null);

  useEffect(() => {
    const fetchHourlyWeather = async () => {
      const apiKey = "da13201d36831242cbc1d64dc1fa4c04";
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

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

  const toggleOverflow = () => {
    setShowOverflow(!showOverflow);
  };

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
    <div
      className={`overflow-${
        showOverflow ? "auto" : "hidden"
      } whitespace-nowrap max-w-full p-5 mt-5 relative`}
    >
      <div
        ref={forecastContainerRef}
        className="flex flex-row items-center relative overflow-hidden"
      >
        {hourlyWeather.map((weather, index) => (
          <div
            key={index}
            className="inline-block w-64 h-48 m-2.5 cursor-pointer transform transition-transform duration-200"
            onClick={() => handleWeatherClick(weather)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <WeatherDisplay
              currentTime={weather.time}
              temperature={weather.temperature}
            />
          </div>
        ))}
      </div>
      <button
        onClick={scrollLeft}
        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-600 border-none rounded-full p-2.5 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
      >
        {"<"}
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-600 border-none rounded-full p-2.5 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
      >
        {">"}
      </button>

      {selectedWeather && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-7 rounded-xl shadow-lg z-20 w-4/5 max-w-lg text-center transition-opacity duration-300 opacity-100">
          <h3 className="mb-5 text-gray-800 text-2xl font-semibold">
            Weather Details
          </h3>
          <p className="mb-3 text-lg">
            <strong>Time:</strong> {selectedWeather.time.toLocaleString()}
          </p>
          <p className="mb-3 text-lg">
            <strong>Temperature:</strong> {selectedWeather.temperature}°C
          </p>
          <p className="mb-3 text-lg">
            <strong>Humidity:</strong> {selectedWeather.humidity}%
          </p>
          <p className="mb-3 text-lg">
            <strong>Wind Speed:</strong> {selectedWeather.windSpeed} m/s
          </p>
          <p className="mb-6 text-lg">
            <strong>Description:</strong> {selectedWeather.weatherDescription}
          </p>
          <button
            onClick={closePopup}
            className="px-6 py-3 bg-green-600 text-white border-none rounded-lg cursor-pointer text-lg shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
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
