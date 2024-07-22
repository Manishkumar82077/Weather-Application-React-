import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CurrentWeather from "./components/CurrentWeather";
import WeatherForecast from "./components/WeatherForecast";
import Seven from "./components/Seven";
function App() {
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("");

  useEffect(() => {
    getCurrentLocation(); // Fetch weather data for current location on component mount
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchWeather = async (url) => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      console.log("API Response:", res.data); // Log API response
      setCurrentWeatherData(res.data);
      const { temp } = res.data.main;
      const bgClass = getBackgroundClass(temp); // Get background color class based on temperature
      setBackgroundClass(bgClass); // Set background color class
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the weather data", error);
      setLoading(false);
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=4b271f37287609d31ede4ba45c1616b4`;
      fetchWeather(currentWeatherUrl);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=4b271f37287609d31ede4ba45c1616b4`;
          fetchWeather(currentWeatherUrl);
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
    <div
      className={`flex flex-col items-center h-fit  w-100  overflow-hidden ${backgroundClass}`}
    >
      <div className="w-full p-4 bg-white shadow-md flex justify-center sticky top-0 space-x-4">
        <input
          className="w-2/3 p-4 border rounded-xl shadow-sm z-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
        <button
          className="p-4 border rounded-xl shadow-sm bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          onClick={getCurrentLocation}
        >
          Use Current Location
        </button>
      </div>
      {currentWeatherData && (
        <CurrentWeather data={currentWeatherData} loading={loading} />
      )}
      {currentWeatherData && <WeatherForecast city={currentWeatherData.name} />}
      {currentWeatherData && <Seven city={currentWeatherData.name} />}
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
