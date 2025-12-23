import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";

import CurrentWeather from "./components/CurrentWeather";
import WeatherForecast from "./components/WeatherForecast";
import { OPEN_WEATHER_API_KEY } from "./config";

import { MdMyLocation, MdDarkMode, MdLightMode } from "react-icons/md";

const GEO_API = "https://api.openweathermap.org/geo/1.0/direct";

function App() {
  /* -------------------- THEME (CSS LEVEL) -------------------- */
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* -------------------- WEATHER STATE -------------------- */
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  /* -------------------- API CALLS -------------------- */

  const fetchForecast = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
      const res = await axios.get(url);
      setForecastData(res.data);
    } catch (err) {
      console.error("Forecast error:", err);
    }
  };

  const fetchAqiForecast = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`;
      const res = await axios.get(url);
      setAqiData(res.data);
    } catch (err) {
      console.error("AQI error:", err);
      setAqiData(null);
    }
  };

  const fetchWeather = async (url, coords) => {
    if (!OPEN_WEATHER_API_KEY) {
      setError("Missing OpenWeather API key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(url);
      setCurrentWeatherData(res.data);

      const lat = coords?.lat ?? res.data.coord.lat;
      const lon = coords?.lon ?? res.data.coord.lon;

      fetchForecast(lat, lon);
      fetchAqiForecast(lat, lon);
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- SEARCH -------------------- */

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(GEO_API, {
        params: {
          q: query,
          limit: 5,
          appid: OPEN_WEATHER_API_KEY,
        },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const handleSearch = () => {
    if (!location.trim()) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
    fetchWeather(url);
  };

  /* -------------------- LOCATION -------------------- */

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
        fetchWeather(url, {
          lat: coords.latitude,
          lon: coords.longitude,
        });
      },
      () => setError("Location permission denied.")
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen w-full app-bg transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* TOP BAR */}
        <div className="w-full p-4 rounded-[2.5rem] border sticky top-4 z-50 card">
          <div className="flex flex-col md:flex-row gap-3 items-center">

            {/* SEARCH INPUT */}
            <div className="flex-1 relative w-full">
              <input
                value={location}
                placeholder="Find your city..."
                className="input w-full p-4 pl-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                onChange={(e) => {
                  setLocation(e.target.value);
                  clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(
                    () => fetchSuggestions(e.target.value),
                    300
                  );
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden z-50 card">
                  {suggestions.map((city) => (
                    <button
                      key={`${city.lat}-${city.lon}`}
                      className="w-full text-left px-6 py-4 hover:bg-blue-500/10 cursor-pointer"
                      onClick={() => {
                        const name = `${city.name}, ${city.country}`;
                        setLocation(name);
                        setSuggestions([]);
                        fetchWeather(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`,
                          { lat: city.lat, lon: city.lon }
                        );
                      }}
                    >
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-xs opacity-60">{city.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">

              <button
                onClick={handleSearch}
                className="btn btn-primary"
              >
                Search
              </button>

              <button
                onClick={getCurrentLocation}
                className="btn btn-ghost"
                title="Use current location"
              >
                <MdMyLocation size={20} />
              </button>

              <button
                onClick={toggleTheme}
                className="btn btn-ghost"
                title="Toggle theme"
              >
                {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
              </button>

            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 px-6 py-3 rounded-xl border text-red-500 bg-red-500/10">
            {error}
          </div>
        )}

        {/* WEATHER */}
        {currentWeatherData && (
          <div className="w-full ">
            <CurrentWeather
              data={currentWeatherData}
              loading={loading}
              aqiData={aqiData}
              forecastData={forecastData}
            />
            <WeatherForecast city={currentWeatherData.name} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
