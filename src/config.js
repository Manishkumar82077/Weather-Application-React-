// Vite exposes env vars via import.meta.env
export const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!OPEN_WEATHER_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("Missing VITE_OPENWEATHER_API_KEY environment variable.");
}

