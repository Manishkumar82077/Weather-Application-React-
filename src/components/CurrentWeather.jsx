import React, { useState, useRef } from "react";
// Import React Icons
import { 
  WiSunrise, WiSunset, WiStrongWind, WiHumidity, 
  WiRain, WiThermometer, WiEye, WiBarometer, WiCloudy, WiDust 
} from "react-icons/wi";
import { 
  MdSunny, MdOutlineNightlight, MdCloud, MdUmbrella, 
  MdThunderstorm, MdAcUnit, MdFoggy, MdClose, MdInfoOutline 
} from "react-icons/md";

/**
 * Maps OpenWeatherMap icon codes to React Icons
 */
function GetWeatherIcon({ iconCode, className }) {
  switch (iconCode) {
    case "01d": return <MdSunny className={className} color="#FFD700" />;
    case "01n": return <MdOutlineNightlight className={className} color="#F0E68C" />;
    case "02d":
    case "02n": return <MdCloud className={className} color="#A9A9A9" />;
    case "03d":
    case "03n": return <WiCloudy className={className} color="#D3D3D3" />;
    case "04d":
    case "04n": return <WiCloudy className={className} color="#808080" />;
    case "09d":
    case "09n": return <MdUmbrella className={className} color="#4682B4" />;
    case "10d":
    case "10n": return <WiRain className={className} color="#5F9EA0" />;
    case "11d":
    case "11n": return <MdThunderstorm className={className} color="#DAA520" />;
    case "13d":
    case "13n": return <MdAcUnit className={className} color="#ADD8E6" />;
    case "50d":
    case "50n": return <MdFoggy className={className} color="#DCDCDC" />;
    default: return <MdCloud className={className} />;
  }
}

function CurrentWeather({ data, loading, aqiData }) {
  const scrollRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  if (loading) {
    return (
      <div className="w-full grid gap-4 md:grid-cols-2 mt-10">
        <div className="card p-6 animate-pulse h-48 bg-zinc-900" />
        <div className="card p-6 animate-pulse h-48 bg-zinc-900" />
      </div>
    );
  }

  if (!data || !data.main) return <p className="text-white">No data available</p>;

  // Formatting and Logic
  const tempCelsius = Number(data.main.temp).toFixed(1);
  const aqiIndex = aqiData?.list?.[0]?.main?.aqi;
  const aqiComponents = aqiData?.list?.[0]?.components;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openModal = (item) => {
    setModalContent(item);
    setModalVisible(true);
  };

  // Build the list of data points with their React Icons
  const weatherDetails = [
    { key: "sunrise", label: "Sunrise", value: formatTime(data.sys.sunrise), icon: <WiSunrise size={32} />, detail: "Exact moment the sun appears on the horizon." },
    { key: "sunset", label: "Sunset", value: formatTime(data.sys.sunset), icon: <WiSunset size={32} />, detail: "Exact moment the sun disappears below the horizon." },
    { key: "wind", label: "Wind", value: `${data.wind.speed} m/s`, icon: <WiStrongWind size={32} />, detail: `Speed: ${data.wind.speed} m/s. Direction: ${data.wind.deg}°` },
    { key: "humidity", label: "Humidity", value: `${data.main.humidity}%`, icon: <WiHumidity size={32} />, detail: "The concentration of water vapor present in the air." },
    { key: "pressure", label: "Pressure", value: `${data.main.pressure} hPa`, icon: <WiBarometer size={32} />, detail: "Atmospheric pressure at sea level." },
    { key: "visibility", label: "Visibility", value: `${(data.visibility / 1000).toFixed(1)} km`, icon: <WiEye size={32} />, detail: "Maximum distance at which objects can be clearly seen." },
    { key: "feelsLike", label: "Feels like", value: `${Number(data.main.feels_like).toFixed(1)}°C`, icon: <WiThermometer size={32} />, detail: "How the temperature actually feels to the human body." },
    { key: "clouds", label: "Cloudiness", value: `${data.clouds.all}%`, icon: <WiCloudy size={32} />, detail: "Fraction of the sky obscured by clouds." },
  ];

  if (aqiIndex) {
    weatherDetails.push({
      key: "aqi",
      label: "Air Quality",
      value: `Level ${aqiIndex}`,
      icon: <WiDust size={32} />,
      detail: `Components (µg/m³): PM2.5: ${aqiComponents.pm2_5}, NO2: ${aqiComponents.no2}, O3: ${aqiComponents.o3}`
    });
  }

  return (
    <div className="w-full text-white mt-10">
      {/* Top Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Weather</p>
              <h2 className="text-4xl font-bold">{data.name}, {data.sys.country}</h2>
              <p className="text-lg text-gray-300 capitalize">{data.weather[0].description}</p>
            </div>
            <GetWeatherIcon iconCode={data.weather[0].icon} className="text-6xl" />
          </div>
          <div className="mt-6">
            <p className="text-6xl font-bold">{tempCelsius}°C</p>
            <p className="text-gray-400">Low: {data.main.temp_min.toFixed(1)}° | High: {data.main.temp_max.toFixed(1)}°</p>
          </div>
        </div>

        {/* Quick Grid */}
        <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-2xl grid grid-cols-2 gap-4">
          {weatherDetails.slice(0, 4).map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="text-blue-400">{item.icon}</span>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Scroller Section */}
      <div className="mt-8 bg-[#121212] border border-[#2a2a2a] p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MdInfoOutline /> Key Details
        </h3>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x" ref={scrollRef}>
          {weatherDetails.map((item) => (
            <div
              key={item.key}
              onClick={() => openModal(item)}
              className="snap-start min-w-[160px] bg-[#1a1a1a] border border-[#333] p-4 rounded-xl hover:bg-[#252525] transition cursor-pointer"
            >
              <div className="text-blue-400 mb-2">{item.icon}</div>
              <p className="text-xs uppercase text-gray-500 font-bold">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#121212] border border-[#2a2a2a] p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="text-blue-400">{modalContent.icon}</div>
              <button onClick={() => setModalVisible(false)} className="text-gray-400 hover:text-white">
                <MdClose size={28} />
              </button>
            </div>
            <h2 className="text-2xl font-bold">{modalContent.label}</h2>
            <p className="text-3xl font-light text-blue-300 mb-4">{modalContent.value}</p>
            <p className="text-gray-400 leading-relaxed">{modalContent.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentWeather;