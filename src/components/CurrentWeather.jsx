import React, { useState, useRef } from "react";
import airspeed from "../../public/airspeed.svg";
import humidity from "../../public/humidity.svg";
import rain from "../../public/rain.svg";
import temperatureFeelsLike from "../../public/temperature-feels-like.svg";
import sunrise from "../../public/sunRise.svg";
import sunset from "../../public/sunset.svg";
import visibility from "../../public/visibility.svg";
import pressure from "../../public/pressure.svg";
import DewPoint from "../../public/DewPoint.svg";
import cloudiness from "../../public/Cloudiness.svg";

// Assuming getWeatherIcon is defined and imported properly elsewhere
function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case "01d":
      return "wb_sunny";
    case "01n":
      return "brightness_2";
    case "02d":
    case "02n":
      return "wb_cloudy";
    case "03d":
    case "03n":
      return "cloud";
    case "04d":
    case "04n":
      return "cloudy";
    case "09d":
    case "09n":
      return "umbrella";
    case "10d":
    case "10n":
      return "rain";
    case "11d":
    case "11n":
      return "flash_on";
    case "13d":
    case "13n":
      return "ac_unit";
    case "50d":
    case "50n":
      return "wb_incandescent";
    default:
      return "wb_cloudy";
  }
}

function CurrentWeather({ data, loading }) {
  const scrollRef = useRef(null); // Ref for the scrolling container
  const [scrollLeft, setScrollLeft] = useState(0); // State to track scroll position

  // State to manage visibility of details in the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // State to manage hover effect on detail items
  const [hoveredItem, setHoveredItem] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent({});
  };

  // Function to handle scrolling to the left
  const scrollLeftHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 200; // Adjust scroll amount as needed
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  // Function to handle scrolling to the right
  const scrollRightHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 200; // Adjust scroll amount as needed
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  // Function to convert Fahrenheit to Celsius and round to one decimal place
  const convertToCelsius = (temp) => {
    return ((temp - 32) * 5) / 9;
  };

  // Function to format UNIX timestamp to AM/PM time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime =
      hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;
    return strTime;
  };

  // Function to provide a weather recommendation based on temperature and weather conditions
  const getWeatherRecommendation = (tempCelsius, weatherIcon) => {
    if (weatherIcon.includes("rain") || weatherIcon.includes("umbrella")) {
      return "It's rainy. Don't forget your umbrella!";
    } else if (
      weatherIcon.includes("snow") ||
      weatherIcon.includes("ac_unit")
    ) {
      return "It's snowy. Wear warm clothes and be careful on the roads!";
    } else if (tempCelsius < 10) {
      return "It's cold. Wear warm clothes!";
    } else if (tempCelsius < 20) {
      return "It's cool. A light jacket might be enough.";
    } else {
      return "It's warm. Enjoy the weather!";
    }
  };

  if (loading) {
    return <p className="animate-pulse">Loading...</p>;
  }

  if (!data || !data.main) {
    return <p>No data available</p>;
  }

  const tempCelsius = convertToCelsius(data.main.temp).toFixed(1);
  const weatherIcon = data.weather[0].icon;
  const recommendation = getWeatherRecommendation(tempCelsius, weatherIcon);
  const tempMinCelsius = data.main.temp_min.toFixed(1);
  const tempMaxCelsius = data.main.temp_max.toFixed(1);

  return (
    <>
      <div className="md:mt-10 text-2xl w-full">
        <div className="flex flex-col md:flex-row w-full">
          <div className="w-full md:w-2/5 flex justify-center items-center flex-col order-first md:order-none p-6">
            <div className="animate-bounce">
              <span className="material-icons-outlined">
                {getWeatherIcon(data.weather[0].icon)}
              </span>
            </div>

            <h1 className="text-7xl font-bold">{data.main.temp}°C</h1>
          </div>
          <div className="w-full md:w-3/5 mt-6 md:mt-0 flex justify-center items-center flex-col">
            <div>
              <p className="text-3xl mt-2">{data.weather[0].description}</p>
            </div>
            <div className="flex items-center mb-4">
              <p className="text-5xl font-bold">
                {data.name}, {data.sys.country}
              </p>
            </div>
            <div className="text-3xl font-bold justify-center items-center">
              <p>{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
      {data.main && (
        <div className="transparent mt-10 rounded-full shadow-sm mx-30 p-6 rounded-md flex justify-center items-center relative w-full">
          <div
            className="flex items-center gap-x-20 overflow h-100 w-150 overflow-hidden"
            ref={scrollRef}
          >
            {[
              {
                key: "sunrise",
                label: "Sunrise",
                value: formatTime(data.sys.sunrise),
                icon: sunrise,
              },
              {
                key: "sunset",
                label: "Sunset",
                value: formatTime(data.sys.sunset),
                icon: sunset,
              },
              {
                key: "rain",
                label: "Rain",
                value: `${data.clouds.all}%`,
                icon: rain,
              },
              {
                key: "feelsLike",
                label: "Feels like",
                value: `${convertToCelsius(data.main.feels_like).toFixed(1)}°C`,
                icon: temperatureFeelsLike,
              },
              {
                key: "wind",
                label: "Wind",
                value: `${data.wind.speed} m/s`,
                icon: airspeed,
              },
              {
                key: "humidity",
                label: "Humidity",
                value: `${data.main.humidity}%`,
                icon: humidity,
              },
              {
                key: "visibility",
                label: "Visibility",
                value: `${(data.visibility / 1000).toFixed(1)} km`,
                icon: visibility,
              },
              {
                key: "pressure",
                label: "Pressure",
                value: `${data.main.pressure} hPa`,
                icon: pressure,
              },
              {
                key: "dewPoint",
                label: "Dew Point",
                value: `${convertToCelsius(data.main.dew_point).toFixed(1)}°C`,
                icon: DewPoint,
              },
              {
                key: "cloudiness",
                label: "Cloudiness",
                value: `${data.clouds.all}% (${data.weather[0].description})`,
                icon: cloudiness,
              },
            ].map((item, index) => (
              <div
                key={item.key}
                className={`flex flex-col items-center hover:scale-110 border-rounded-md justify-center p-4 shadow-lg rounded-md transition-all duration-300 transform w-24 h-24 cursor-pointer hover:bg-gray-200`}
                onClick={() => openModal(item)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ width: "120px", height: "120px" }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="h-12 w-12 mb-2"
                />
                <p>{item.key}</p>
                <p className="text-center">{item.value}</p>
                {hoveredItem === index && <p className="text-center"></p>}
              </div>
            ))}
          </div>

          {/* Scroll buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2  bg-blue-600 border-none rounded-full p-2 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            onClick={scrollLeftHandler}
          >
            {"<"}
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-blue-600 border-none rounded-full p-2 text-white shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            onClick={scrollRightHandler}
          >
            {">"}
          </button>
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{modalContent.label}</h2>
            <p className="text-lg">{modalContent.value}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CurrentWeather;

// import React, { useState, useRef } from "react";
// import airspeed from "../../public/airspeed.svg";
// import location from "../../public/location.svg";
// import humidity from "../../public/humidity.svg";
// import rain from "../../public/rain.svg";
// import temperatureFeelsLike from "../../public/temperature-feels-like.svg";
// import sunrise from "../../public/sunRise.svg";
// import sunset from "../../public/sunset.svg";
// import visibility from "../../public/visibility.svg";
// import pressure from "../../public/pressure.svg";
// import aqi from "../../public/AQI.svg";
// import DewPoint from "../../public/DewPoint.svg";
// import cloudiness from "../../public/Cloudiness.svg";
// import moonphase from "../../public/Moon Phase.svg";
// import uvIndex from "../../public/UV Index.svg";

// // Assuming getWeatherIcon is defined and imported properly elsewhere
// function getWeatherIcon(iconCode) {
//   switch (iconCode) {
//     case "01d":
//       return "wb_sunny";
//     case "01n":
//       return "brightness_2";
//     case "02d":
//     case "02n":
//       return "wb_cloudy";
//     case "03d":
//     case "03n":
//       return "cloud";
//     case "04d":
//     case "04n":
//       return "cloudy";
//     case "09d":
//     case "09n":
//       return "umbrella";
//     case "10d":
//     case "10n":
//       return "rain";
//     case "11d":
//     case "11n":
//       return "flash_on";
//     case "13d":
//     case "13n":
//       return "ac_unit";
//     case "50d":
//     case "50n":
//       return "wb_incandescent";
//     default:
//       return "wb_cloudy";
//   }
// }

// function CurrentWeather({ data, loading }) {
//   const scrollRef = useRef(null); // Ref for the scrolling container
//   const [scrollLeft, setScrollLeft] = useState(0); // State to track scroll position

//   // Function to handle scrolling to the left
//   const scrollLeftHandler = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollLeft -= 200; // Adjust scroll amount as needed
//       setScrollLeft(scrollRef.current.scrollLeft);
//     }
//   };

//   // Function to handle scrolling to the right
//   const scrollRightHandler = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollLeft += 200; // Adjust scroll amount as needed
//       setScrollLeft(scrollRef.current.scrollLeft);
//     }
//   };

//   // Function to convert Fahrenheit to Celsius and round to one decimal place
//   const convertToCelsius = (temp) => {
//     return ((temp - 32) * 5) / 9;
//   };

//   // Function to format UNIX timestamp to AM/PM time
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp * 1000);
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     const strTime =
//       hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;
//     return strTime;
//   };

//   // Function to provide a weather recommendation based on temperature and weather conditions
//   const getWeatherRecommendation = (tempCelsius, weatherIcon) => {
//     if (weatherIcon.includes("rain") || weatherIcon.includes("umbrella")) {
//       return "It's rainy. Don't forget your umbrella!";
//     } else if (
//       weatherIcon.includes("snow") ||
//       weatherIcon.includes("ac_unit")
//     ) {
//       return "It's snowy. Wear warm clothes and be careful on the roads!";
//     } else if (tempCelsius < 10) {
//       return "It's cold. Wear warm clothes!";
//     } else if (tempCelsius < 20) {
//       return "It's cool. A light jacket might be enough.";
//     } else {
//       return "It's warm. Enjoy the weather!";
//     }
//   };

//   if (loading) {
//     return <p className="animate-pulse">Loading...</p>;
//   }

//   if (!data || !data.main) {
//     return <p>No data available</p>;
//   }

//   // Add console logs to debug
//   console.log("Weather Data: ", data);

//   const tempCelsius = convertToCelsius(data.main.temp).toFixed(1);
//   const weatherIcon = data.weather[0].icon;
//   const recommendation = getWeatherRecommendation(tempCelsius, weatherIcon);
//   const tempMinCelsius = convertToCelsius(data.main.temp_min).toFixed(1);
//   const tempMaxCelsius = convertToCelsius(data.main.temp_max).toFixed(1);

//   return (
//     <>
//       <div className="md:mt-10 text-2xl w-full">
//         <div className="flex flex-col md:flex-row w-full">
//           <div className="w-full md:w-2/5 flex justify-center items-center flex-col order-first md:order-none p-6">
//             <div className="animate-bounce">
//               <span className="material-icons-outlined">
//                 {getWeatherIcon(data.weather[0].icon)}
//               </span>
//             </div>

//             <h1 className="text-7xl font-bold">{tempCelsius}°C</h1>
//             <p className="text-2xl mt-2">
//               Min: {tempMinCelsius}°C | Max: {tempMaxCelsius}°C
//             </p>
//           </div>
//           <div className="w-full md:w-3/5 mt-6 md:mt-0 flex justify-center items-center flex-col">
//             <div>
//               <p className="text-3xl mt-2">{data.weather[0].description}</p>
//             </div>
//             <div className="flex items-center mb-4">
//               <p className="text-5xl font-bold">
//                 {data.name}, {data.sys.country}
//               </p>
//             </div>
//             <div className="text-3xl font-bold justify-center items-center">
//               <p>{recommendation}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {data.main && (
//         <div className="bg-gray-100 border mt-10 rounded-full shadow-sm mx-30 p-6 rounded-md flex justify-center items-center relative w-full">
//           <div
//             className="flex items-center gap-x-20 overflow-x-auto overflow-hidden"
//             ref={scrollRef}
//           >
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={sunrise} alt="Sunrise" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Sunrise: <br />
//                 {formatTime(data.sys.sunrise)}
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={sunset} alt="Sunset" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Sunset: <br />
//                 {formatTime(data.sys.sunset)}
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={rain} alt="Rain" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Rain: <br />
//                 {data.clouds.all}%
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "150px",
//                 height: "100px",
//               }}
//             >
//               <img
//                 src={temperatureFeelsLike}
//                 alt="Feels Like Temperature"
//                 className="w-6 h-6 mr-2"
//               />
//               <p className="text-lg">
//                 Feels like: <br />
//                 {convertToCelsius(data.main.feels_like).toFixed(1)}°C
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "120px",
//                 height: "100px",
//               }}
//             >
//               <img src={airspeed} alt="Wind Speed" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Wind : <br />
//                 {data.wind.speed} m/s
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={humidity} alt="Humidity" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Humidity: <br />
//                 {data.main.humidity}%
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={visibility} alt="Visibility" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Visibility: <br />
//                 {data.visibility} m
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={pressure} alt="Pressure" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Pressure: <br />
//                 {data.main.pressure} hPa
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "100px",
//                 height: "100px",
//               }}
//             >
//               <img src={DewPoint} alt="Dew Point" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Dew Point: <br />
//                 {convertToCelsius(data.main.dew_point).toFixed(1)}°C
//               </p>
//             </div>
//             <div
//               className="flex items-center"
//               style={{
//                 minWidth: "200px",
//                 height: "100px",
//               }}
//             >
//               <img src={cloudiness} alt="Cloudiness" className="w-6 h-6 mr-2" />
//               <p className="text-lg">
//                 Cloudiness: <br />
//                 {data.clouds.all}% ({data.weather[0].description})
//               </p>
//             </div>
//           </div>

//           {/* Scroll buttons */}
//           <button
//             className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 shadow-md"
//             onClick={scrollLeftHandler}
//           >
//             {"<"}
//           </button>
//           <button
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 shadow-md"
//             onClick={scrollRightHandler}
//           >
//             {">"}
//           </button>
//         </div>
//       )}
//     </>
//   );
// }
