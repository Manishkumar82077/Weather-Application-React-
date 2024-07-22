import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Seven = ({ city }) => {
  const [dailyForecast, setDailyForecast] = useState([]);
  const scrollContainerRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchWeather = async (lat, lon) => {
    const apiKey = "da13201d36831242cbc1d64dc1fa4c04"; // Replace with your API key
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`
      );

      setDailyForecast(data.daily);
    } catch (error) {
      console.error("Error fetching the weather data", error);
    }
  };

  useEffect(() => {
    const fetchCityWeather = async () => {
      const apiKey = "da13201d36831242cbc1d64dc1fa4c04"; // Replace with your API key
      try {
        const { data: locationData } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        const { lat, lon } = locationData.coord;

        fetchWeather(lat, lon);
      } catch (error) {
        console.error("Error fetching the weather data", error);
      }
    };

    fetchCityWeather();
  }, [city]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const openModal = (day) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  return (
    <div className="relative mt-4 mx-2 sm:mx-10 px-4">
      <div className="relative overflow-hidden">
        <button
          className="absolute left-1 sm:left-2.5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-600 border-none rounded-full p-2 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
          onClick={scrollLeft}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &lt;
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 p-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {dailyForecast.map((day, index) => (
            <div
              key={index}
              onClick={() => openModal(day)}
              className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-36 sm:w-40 md:w-48 bg-white shadow-md cursor-pointer transition-transform transform hover:scale-105"
            >
              <p className="text-sm sm:text-lg font-semibold">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-500">
                {day.temp.day} °C
              </p>
              <p className="mt-2 capitalize text-xs sm:text-sm">
                {day.weather[0].description}
              </p>
            </div>
          ))}
        </div>
        <button
          className="absolute right-2 sm:right-2.5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-600 border-none rounded-full p-2 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
          onClick={scrollRight}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &gt;
        </button>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 overflow-hidden flex justify-center items-center">
          <div className="bg-white p-4  rounded-lg shadow-lg max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {new Date(selectedDay.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <p className="text-4xl font-bold text-blue-500">
              Temperature: {selectedDay.temp.day} °C
            </p>
            <p>Description: {selectedDay.weather[0].description}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seven;
