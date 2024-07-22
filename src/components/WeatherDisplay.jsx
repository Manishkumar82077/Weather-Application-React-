import React from "react";

const WeatherDisplay = ({ currentTime, temperature }) => {
  return (
    <div className=" flex justify-center ">
      <div className=" flex-shrink-0 border border-gray-300 rounded-lg p-4 w-48 bg-white shadow-md cursor-pointer transition-transform transform hover:scale-105">
        <p className="text-lg font-bold mb-2">
          {currentTime.toLocaleTimeString()}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          {currentTime.toLocaleDateString()}
        </p>
        <p className="text-4xl font-bold text-blue-500">
          {temperature ? `${temperature} °C` : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
