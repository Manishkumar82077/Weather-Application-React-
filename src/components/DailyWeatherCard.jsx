import React from "react";

const DailyWeatherCard = ({ date, temperature, weather, icon }) => {
  return (
    <div className=" hover:scale-150 m-4 p-4 border rounded-md shadow-md text-center">
      <img
        src={`http://openweathermap.org/img/wn/${icon}.png`}
        alt="Weather Icon"
        className="mx-auto"
      />
      <h2 className="text-lg font-semibold">{date.toLocaleDateString()}</h2>
      <p className="text-gray-600">{weather}</p>
      <p className="text-2xl font-bold">{temperature} °C</p>
    </div>
  );
};

export default DailyWeatherCard;
