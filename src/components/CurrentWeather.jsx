import { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine, Label
} from 'recharts';
import {
  WiSunrise, WiSunset, WiHumidity,
  WiBarometer, WiCloudy, WiRaindrops, WiCloud,
} from "react-icons/wi";
import {
  MdSunny, MdOutlineNightlight, MdCloud, MdUmbrella,
  MdThunderstorm, MdAcUnit, MdFoggy,
  MdVisibility, MdTimeline, MdTrendingUp,
  MdHealthAndSafety, MdAir, MdExplore, MdWaterDrop, MdCompress,
  MdThermostat
} from "react-icons/md";

/**
 * SEVERITY COLOR ENGINE - Updated to use dynamic border and background opacity
 */
const getSeverityColor = (val, type) => {
  if (type === 'aqi') {
    if (val <= 50) return { hex: "#4ade80", tailwind: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" };
    if (val <= 100) return { hex: "#facc15", tailwind: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" };
    if (val <= 150) return { hex: "#fb923c", tailwind: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" };
    return { hex: "#ef4444", tailwind: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
  }
  return { hex: "#3b82f6", tailwind: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" };
};

const calculateNumericAQI = (pm25) => {
  if (!pm25) return 0;
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  return Math.round(151 + pm25);
};

const getSunProgress = (sunrise, sunset) => {
  const now = Date.now() / 1000;
  if (now > sunset) return 100;
  if (now < sunrise) return 0;
  return ((now - sunrise) / (sunset - sunrise)) * 100;
};

function GetWeatherIcon({ iconCode, className }) {
  const icons = {
    "01d": <MdSunny className={className} color="#FFD700" />,
    "01n": <MdOutlineNightlight className={className} color="#F0E68C" />,
    "02d": <MdCloud className={className} color="#A9A9A9" />,
    "02n": <MdCloud className={className} color="#A9A9A9" />,
    "03d": <WiCloudy className={className} color="#D3D3D3" />,
    "04d": <WiCloudy className={className} color="#808080" />,
    "09d": <MdUmbrella className={className} color="#4682B4" />,
    "10d": <WiRaindrops className={className} color="#5F9EA0" />,
    "11d": <MdThunderstorm className={className} color="#DAA520" />,
    "13d": <MdAcUnit className={className} color="#ADD8E6" />,
    "50d": <MdFoggy className={className} color="#DCDCDC" />,
  };
  return icons[iconCode] || <MdCloud className={className} />;
}

function CurrentWeather({ data, loading, aqiData, forecastData }) {
  const [activePollutant, setActivePollutant] = useState("aqi");
  const [chartMode, setChartMode] = useState("temp");

  const pollutants = useMemo(() => [
    { id: "aqi", name: "AQI", unit: "index" },
    { id: "pm2_5", name: "PM 2.5", unit: "μg/m³" },
    { id: "pm10", name: "PM 10", unit: "μg/m³" },
    { id: "co", name: "CO", unit: "μg/m³" },
    { id: "no2", name: "NO₂", unit: "μg/m³" },
    { id: "o3", name: "O₃", unit: "μg/m³" },
  ], []);

  const { tempChartData, dailyHigh, dailyLow } = useMemo(() => {
    if (!forecastData?.list) return { tempChartData: [], dailyHigh: 0, dailyLow: 0 };
    const hourly = forecastData.list.slice(0, 24).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      value: Math.round(item.main.temp),
    }));
    const temps = hourly.map(h => h.value);
    return { tempChartData: hourly, dailyHigh: Math.max(...temps), dailyLow: Math.min(...temps) };
  }, [forecastData]);

  const { pollutionChartData, currentScore, severity } = useMemo(() => {
    if (!aqiData?.list) return { pollutionChartData: [], currentScore: 0, severity: getSeverityColor(0, 'aqi') };
    const mapped = aqiData.list.slice(0, 24).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      value: activePollutant === "aqi" ? calculateNumericAQI(item.components.pm2_5) : item.components[activePollutant],
    }));
    const score = activePollutant === "aqi" ? calculateNumericAQI(aqiData.list[0].components.pm2_5) : aqiData.list[0].components[activePollutant];
    return { pollutionChartData: mapped, currentScore: score, severity: getSeverityColor(score, 'aqi') };
  }, [aqiData, activePollutant]);

  if (loading) return <div className="p-10 animate-pulse h-96 card rounded-[3rem] mt-10 opacity-50" />;
  if (!data || !data.main) return null;

  const sunProgress = getSunProgress(data.sys.sunrise, data.sys.sunset);

  return (
    <div className="w-full mt-10 space-y-6 pb-20 font-sans transition-colors duration-500">

      {/* 1. TOP STATS GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* HERO CARD */}
        <div className={`lg:col-span-2 card border-2 ${severity.border} p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-colors duration-500`}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-4xl md:text-5xl font-bold">{data.name}</h2>
                <span className="bg-current/10 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">{data.sys.country}</span>
              </div>
              <p className="text-xl text-blue-500 font-medium mt-1 uppercase italic">{data.weather[0].description}</p>
            </div>
            <GetWeatherIcon iconCode={data.weather[0].icon} className="text-7xl md:text-8xl drop-shadow-2xl" />
          </div>

          <div className="flex items-baseline gap-4 mt-6">
            <p className="text-7xl md:text-9xl font-black tracking-tighter">{Math.round(data.main.temp)}°</p>
            <div className="font-bold opacity-70">
              <p className="text-red-500">H: {dailyHigh || Math.round(data.main.temp_max)}°</p>
              <p className="text-blue-500">L: {dailyLow || Math.round(data.main.temp_min)}°</p>
            </div>
          </div>

          <div className="mt-8 border-t border-current/10 pt-6">
            <div className="flex justify-between text-[10px] font-bold opacity-50 uppercase tracking-widest mb-2">
              <span className="flex items-center gap-1"><WiSunrise size={18} /> {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>Day Cycle {Math.round(sunProgress)}%</span>
              <span className="flex items-center gap-1">{new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <WiSunset size={18} /></span>
            </div>
            <div className="w-full h-3 bg-current/5 rounded-full p-[2px]">
              <div className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${sunProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* AQI RADIAL BOX */}
        <div className={`card border-2 ${severity.border} p-8 rounded-[3rem] flex flex-col justify-center items-center text-center shadow-2xl transition-colors duration-500`}>
          <p className="text-[10px] opacity-50 font-black uppercase tracking-widest mb-2">Air Quality Index</p>
          <p className={`text-8xl font-black tracking-tighter ${severity.tailwind}`}>{Math.round(currentScore)}</p>
          <div className={`mt-4 px-6 py-2 rounded-full text-xs font-black uppercase ${severity.bg} ${severity.tailwind}`}>
            {currentScore <= 50 ? "Healthy" : currentScore <= 100 ? "Moderate" : "Unhealthy"}
          </div>
        </div>

        {/* THERMAL SENSATION */}
        <div className="card p-4 rounded-[3rem] shadow-2xl flex flex-col gap-4">
          <div className="flex-1 bg-current/5 rounded-3xl p-6 flex flex-col justify-center items-center border border-current/5">
            <WiHumidity className="text-blue-500 text-4xl mb-1" />
            <p className="text-[10px] opacity-50 font-black uppercase">Humidity</p>
            <p className="text-3xl font-bold">{data.main.humidity}%</p>
          </div>
          <div className="flex-1 bg-current/5 rounded-3xl p-6 flex flex-col justify-center items-center border border-current/5">
            <MdTrendingUp className="text-orange-500 text-3xl mb-1" />
            <p className="text-[10px] opacity-50 font-black uppercase">Feels Like</p>
            <p className="text-3xl font-bold">{Math.round(data.main.feels_like)}°</p>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC ANALYTICS SECTION */}
      <div className="card p-8 md:p-12 rounded-[3.5rem] shadow-2xl">
        <div className="flex flex-col xl:flex-row justify-between items-start mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex gap-2 bg-current/5 p-1.5 rounded-2xl border border-current/10 w-fit">
              <button
                onClick={() => setChartMode('temp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartMode === 'temp' ? 'bg-orange-500 text-white shadow-lg' : 'opacity-60'}`}
              >
                Temperature
              </button>
              <button
                onClick={() => setChartMode('pollution')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartMode === 'pollution' ? 'bg-blue-600 text-white shadow-lg' : 'opacity-60'}`}
              >
                Pollution
              </button>
            </div>
            <h3 className="text-2xl font-bold flex items-center gap-3">
              {chartMode === 'temp' ? <MdThermostat className="text-orange-500" size={32} /> : <MdTimeline className="text-blue-500" size={32} />}
              {chartMode === 'temp' ? "24h Temperature Flow" : "Pollution Severity Timeline"}
            </h3>
          </div>

          {chartMode === 'pollution' && (
            <div className="flex flex-wrap justify-center gap-2 bg-current/5 p-2 rounded-3xl border border-current/10">
              {pollutants.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePollutant(p.id)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${activePollutant === p.id ? "bg-blue-600 text-white shadow-xl" : "opacity-60 hover:opacity-100"}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-[350px] md:h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartMode === 'temp' ? tempChartData : pollutionChartData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartMode === 'temp' ? "#f59e0b" : severity.hex} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={chartMode === 'temp' ? "#3b82f6" : severity.hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
              <XAxis dataKey="time" stroke="currentColor" opacity={0.6} fontSize={12} axisLine={false} tickLine={false} dy={15} />
              <YAxis
                stroke="currentColor" opacity={0.6} fontSize={12} axisLine={false} tickLine={false} dx={-10}
                domain={chartMode === 'temp' ? ['dataMin - 2', 'dataMax + 2'] : ['auto', 'auto']}
                tickFormatter={(val) => chartMode === 'temp' ? `${val}°` : val}
              />
              <Tooltip
                cursor={{ stroke: 'currentColor', strokeWidth: 2, opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text)' }}
              />

              {chartMode === 'temp' && (
                <>
                  <ReferenceLine y={dailyHigh} stroke="#ef4444" strokeDasharray="3 3">
                    <Label value={`H: ${dailyHigh}°`} position="top" fill="#ef4444" fontSize={10} fontWeight="bold" />
                  </ReferenceLine>
                  <ReferenceLine y={dailyLow} stroke="#3b82f6" strokeDasharray="3 3">
                    <Label value={`L: ${dailyLow}°`} position="bottom" fill="#3b82f6" fontSize={10} fontWeight="bold" />
                  </ReferenceLine>
                </>
              )}

              <Area
                type="monotone"
                dataKey="value"
                stroke={chartMode === 'temp' ? "#f59e0b" : severity.hex}
                strokeWidth={5}
                fill="url(#chartGradient)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. SCROLLABLE ATMOSPHERIC DETAILS */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MdHealthAndSafety className="text-blue-500" /> Atmospheric Details
          </h3>
          <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest animate-pulse">Swipe →</span>
        </div>

        <div className="overflow-x-auto p-4 scrollbar-hide flex gap-6 snap-x snap-mandatory">
          {[
            { label: "Wind Speed", val: `${data.wind.speed} m/s`, icon: <MdAir /> },
            { label: "Wind Direction", val: `${data.wind.deg}°`, icon: <MdExplore style={{ transform: `rotate(${data.wind.deg}deg)` }} /> },
            { label: "Visibility", val: `${(data.visibility / 1000).toFixed(1)} km`, icon: <MdVisibility /> },
            { label: "Pressure", val: `${data.main.pressure} hPa`, icon: <WiBarometer /> },
            { label: "Cloudiness", val: `${data.clouds.all}%`, icon: <WiCloud /> },
            { label: "Sea Level", val: `${data.main.sea_level || 'N/A'}`, icon: <MdWaterDrop /> },
            { label: "Ground Level", val: `${data.main.grnd_level || 'N/A'}`, icon: <MdCompress /> },
          ].map((m, i) => (
            <div
              key={i}
              className="group min-w-[160px] snap-start card p-6 rounded-[2.5rem] text-center 
                   transition-all duration-300 ease-out
                   hover:scale-110 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]
                   hover:border-blue-500/50 cursor-default"
            >
              <div className="text-blue-500 mb-3 flex justify-center text-4xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                {m.icon}
              </div>
              <p className="text-[10px] opacity-50 font-bold uppercase mb-1 tracking-tighter">
                {m.label}
              </p>
              <p className="text-lg font-black tracking-tight transition-colors duration-300 group-hover:text-blue-500">
                {m.val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
GetWeatherIcon.propTypes = {
  iconCode: PropTypes.string.isRequired,
  className: PropTypes.string,
};

CurrentWeather.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  aqiData: PropTypes.object,
  forecastData: PropTypes.object
};

// THIS IS THE MISSING LINE:
export default CurrentWeather;