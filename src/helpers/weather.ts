import { Ionicons } from "@expo/vector-icons";

// Open-Meteo forecasts up to 16 days ahead
export const FORECAST_DAYS = 16;

export type Forecast = {
  time: number[]; // hour starts, ms since epoch (UTC)
  temperature: number[];
  rainChance: number[];
  rain: number[]; // mm
  code: number[]; // WMO weather code
  wind: number[]; // km/h
  humidity: number[];
};

export type HourForecast = {
  time: number;
  temperature: number;
  rainChance: number;
  rain: number;
  code: number;
  wind: number;
  humidity: number;
};

export const getHour = (forecast: Forecast, index: number): HourForecast => ({
  time: forecast.time[index],
  temperature: forecast.temperature[index],
  rainChance: forecast.rainChance[index],
  rain: forecast.rain[index],
  code: forecast.code[index],
  wind: forecast.wind[index],
  humidity: forecast.humidity[index],
});

// The forecast hour a moment falls in, if the forecast reaches that far
export const getHourAt = (forecast: Forecast, ms: number) => {
  const index = forecast.time.findIndex((t) => ms >= t && ms < t + 3600000);
  return index === -1 ? undefined : getHour(forecast, index);
};

// Hours within [start, end)
export const getHoursBetween = (forecast: Forecast, start: number, end: number) =>
  forecast.time.flatMap((t, index) => (t >= start && t < end ? [getHour(forecast, index)] : []));

type Condition = { label: string; icon: keyof typeof Ionicons.glyphMap };

// WMO weather interpretation codes, as used by Open-Meteo
export const getCondition = (code: number): Condition => {
  if (code === 0) return { label: "Clear", icon: "sunny-outline" };
  if (code <= 2) return { label: "Partly cloudy", icon: "partly-sunny-outline" };
  if (code === 3) return { label: "Overcast", icon: "cloudy-outline" };
  if (code <= 48) return { label: "Fog", icon: "cloudy-outline" };
  if (code <= 57) return { label: "Drizzle", icon: "rainy-outline" };
  if (code <= 67) return { label: "Rain", icon: "rainy-outline" };
  if (code <= 77) return { label: "Snow", icon: "snow-outline" };
  if (code <= 82) return { label: "Showers", icon: "rainy-outline" };
  if (code <= 86) return { label: "Snow showers", icon: "snow-outline" };
  return { label: "Thunderstorms", icon: "thunderstorm-outline" };
};

// Worst weather of a set of hours, so a stormy afternoon isn't hidden by a sunny morning
export const getWorstCode = (hours: HourForecast[]) =>
  hours.reduce((worst, hour) => Math.max(worst, hour.code), 0);

export const formatRainChance = (chance: number) => `${Math.round(chance)}%`;
