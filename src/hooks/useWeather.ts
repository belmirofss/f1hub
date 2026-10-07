import { useQuery } from "@tanstack/react-query";
import moment from "moment-timezone";
import { OpenMeteo } from "../api";
import { FORECAST_DAYS, Forecast } from "../helpers/weather";
import { getSessions } from "../helpers/sessions";
import { Race } from "../types";

type Response = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    // Can be null towards the end of the forecast range
    precipitation_probability: (number | null)[];
    precipitation: (number | null)[];
    weather_code: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
  };
};

// Only races whose weekend starts within the forecast range and isn't over yet
export const hasForecast = (race: Race | undefined, now: number) => {
  if (!race) return false;
  const sessions = getSessions(race);
  const first = sessions[0]?.start.valueOf() ?? 0;
  const last = sessions[sessions.length - 1]?.start.valueOf() ?? 0;
  return first - now < (FORECAST_DAYS - 1) * 86400000 && last + 3 * 3600000 > now;
};

// Hourly forecast at the circuit, from Open-Meteo (free, no key)
export const useWeather = ({ race, now }: { race?: Race; now: number }) => {
  const location = race?.Circuit.Location;
  return useQuery({
    queryKey: ["WEATHER", location?.lat, location?.long],
    queryFn: () =>
      OpenMeteo.get<Response>("forecast", {
        params: {
          latitude: location?.lat,
          longitude: location?.long,
          hourly: [
            "temperature_2m",
            "precipitation_probability",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "relative_humidity_2m",
          ].join(","),
          forecast_days: FORECAST_DAYS,
          timezone: "GMT",
        },
      }),
    select: ({ data }): Forecast => ({
      time: data.hourly.time.map((t) => moment.utc(t).valueOf()),
      temperature: data.hourly.temperature_2m,
      rainChance: data.hourly.precipitation_probability.map((v) => v ?? 0),
      rain: data.hourly.precipitation.map((v) => v ?? 0),
      code: data.hourly.weather_code,
      wind: data.hourly.wind_speed_10m,
      humidity: data.hourly.relative_humidity_2m,
    }),
    enabled: !!location && hasForecast(race, now),
    staleTime: 1000 * 60 * 30,
  });
};
