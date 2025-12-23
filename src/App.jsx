import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import CurrentWeather from "./components/CurrentWeather";
import WeatherForecast from "./components/WeatherForecast";
import Seven from "./components/Seven";
import { OPEN_WEATHER_API_KEY } from "./config";
function App() {
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("");
  const [error, setError] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    getCurrentLocation(); // Fetch weather data for current location on component mount
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchWeather = async (url, coords) => {
    if (!OPEN_WEATHER_API_KEY) {
      setError("Missing API key. Set VITE_OPENWEATHER_API_KEY in .env.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(url);
      console.log("API Response:", res.data); // Log API response
      setCurrentWeatherData(res.data);
      const { temp } = res.data.main;
      const bgClass = getBackgroundClass(temp); // Get background color class based on temperature
      setBackgroundClass(bgClass); // Set background color class
      setError("");
      if (coords) {
        fetchAqi(coords.lat, coords.lon);
      } else if (res.data.coord) {
        fetchAqi(res.data.coord.lat, res.data.coord.lon);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the weather data", error);
      setError("Could not load weather right now. Please try again.");
      setLoading(false);
    }
  };

  const fetchAqi = async (lat, lon) => {
    try {
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`;
      const res = await axios.get(aqiUrl);
      setAqiData(res.data);
    } catch (err) {
      console.error("Error fetching AQI", err);
      setAqiData(null);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${OPEN_WEATHER_API_KEY}`;
      const res = await axios.get(url);
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Error fetching suggestions", err);
      setSuggestions([]);
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!location.trim()) return;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
    fetchWeather(currentWeatherUrl);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
          fetchWeather(currentWeatherUrl, { lat: latitude, lon: longitude });
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        },
        (error) => {
          console.error("Error getting the current location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Function to determine background color class based on temperature
  const getBackgroundClass = (temp) => {
    if (temp >= 25) {
      return "hot";
    } else if (temp < 10) {
      return "cold";
    } else {
      return "normal";
    }
  };

  return (
    <div className={`min-h-screen w-full ${backgroundClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-hidden">
        <div className="w-full p-5 bg-[#161616]/80 backdrop-blur border border-[#2a2a2a] rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center sticky top-0 space-y-3 md:space-y-0 md:space-x-4 z-20">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">Find a city or use your location</p>
            <input
              className="w-full p-4 border border-[#2a2a2a] rounded-xl shadow-sm bg-[#0f0f0f] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={location}
              onChange={(event) => {
                const value = event.target.value;
                setLocation(value);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
              }}
              onKeyDown={searchLocation}
              placeholder="e.g. London, Tokyo, New York"
              type="text"
              aria-label="Search city"
            />
            {suggestions.length > 0 && (
              <div className="mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((sugg) => (
                  <button
                    key={`${sugg.lat}-${sugg.lon}-${sugg.name}`}
                    className="w-full text-left px-4 py-3 hover:bg-[#242424] focus:bg-[#242424] focus:outline-none"
                    onClick={() => {
                      setLocation(
                        `${sugg.name}${sugg.state ? ", " + sugg.state : ""}, ${sugg.country}`
                      );
                      setSuggestions([]);
                      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${sugg.lat}&lon=${sugg.lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
                      fetchWeather(currentWeatherUrl, { lat: sugg.lat, lon: sugg.lon });
                    }}
                  >
                    <p className="text-white font-semibold">
                      {sugg.name} {sugg.state ? `, ${sugg.state}` : ""} ({sugg.country})
                    </p>
                    <p className="text-xs text-gray-400">
                      {sugg.lat.toFixed(2)}, {sugg.lon.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            className="hidden"
            aria-hidden="true"
          />
          <div className="flex gap-2 pt-1 md:pt-0">
            <button
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="btn btn-ghost"
              onClick={getCurrentLocation}
            >
              Use Current Location
            </button>
          </div>
        </div>
        {error && (
          <div className="w-full mt-4 rounded-md bg-[#2a1c1c] text-[#f8d7da] border border-[#472525] p-3 text-center">
            {error}
          </div>
        )}
        {currentWeatherData && (
          <CurrentWeather data={currentWeatherData} loading={loading} aqiData={aqiData} />
        )}
        {currentWeatherData && (
          <WeatherForecast city={currentWeatherData.name} />
        )}
        {currentWeatherData && <Seven city={currentWeatherData.name} />}
      </div>
    </div>
  );
}

export default App;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";
// import CurrentWeather from "./components/CurrentWeather";
// import HourlyWeatherForecast from "./components/HourlyWeatherForecast";

// function App() {
//   const [currentWeatherData, setCurrentWeatherData] = useState(null);
//   const [hourlyWeatherData, setHourlyWeatherData] = useState(null);
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getCurrentLocation(); // Fetch weather data for current location on component mount
//   }, []); // Empty dependency array ensures this effect runs only once

//   const fetchWeather = async (url, isHourly = false) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(url);
//       console.log("API Response:", res.data); // Log API response
//       if (isHourly) {
//         setHourlyWeatherData(res.data.hourly.slice(0, 8)); // Save only the first 8 hours of forecast
//       } else {
//         setCurrentWeatherData(res.data);
//         const { lat, lon } = res.data.coord;
//         fetchHourlyWeather(lat, lon);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching the weather data", error);
//       setLoading(false);
//     }
//   };

//   const fetchHourlyWeather = async (lat, lon) => {
//     const hourlyWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=imperial&appid=4b271f37287609d31ede4ba45c1616b4`;
//     await fetchWeather(hourlyWeatherUrl, true);
//   };

//   const searchLocation = (event) => {
//     if (event.key === "Enter") {
//       const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=4b271f37287609d31ede4ba45c1616b4`;
//       fetchWeather(currentWeatherUrl);
//     }
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=4b271f37287609d31ede4ba45c1616b4`;
//           await fetchWeather(currentWeatherUrl);
//           setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
//         },
//         (error) => {
//           console.error("Error getting the current location", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center h-screen">
//       <div className="w-full p-4 bg-white shadow-md flex justify-center sticky top-0 space-x-4">
//         <input
//           className="w-2/3 p-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//           value={location}
//           onChange={(event) => setLocation(event.target.value)}
//           onKeyPress={searchLocation}
//           placeholder="Enter Location"
//           type="text"
//         />
//         <button
//           className="p-4 border rounded-xl shadow-sm bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
//           onClick={getCurrentLocation}
//         >
//           Use Current Location
//         </button>
//       </div>
//       <CurrentWeather data={currentWeatherData} loading={loading} />
//       <HourlyWeatherForecast data={hourlyWeatherData} />
//     </div>
//   );
// }

// export default App;
