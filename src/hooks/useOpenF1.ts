import { useQuery } from "@tanstack/react-query";
import moment from "moment-timezone";
import { OpenF1 } from "../api";
import {
  CarLocation,
  OpenF1Driver,
  OpenF1Lap,
  OpenF1Session,
  RaceControlMessage,
  Stint,
  TeamRadio,
} from "../types";

// OpenF1 has no data before this season
export const OPENF1_FIRST_SEASON = 2023;

// Past sessions never change, so cache them for the whole app session
const PAST = 1000 * 60 * 60 * 6;

// Finds OpenF1's Grand Prix session for a race, matched by its date
export const useOpenF1RaceSession = ({ season, date }: { season?: string; date?: string }) => {
  const enabled = !!season && !!date && Number(season) >= OPENF1_FIRST_SEASON;
  return useQuery({
    queryKey: ["OPENF1_RACE_SESSIONS", season],
    queryFn: () =>
      OpenF1.get<OpenF1Session[]>("sessions", { params: { year: season, session_name: "Race" } }),
    select: (response) => response.data.find((s) => s.date_start.slice(0, 10) === date),
    enabled,
    staleTime: PAST,
  });
};

const useSessionList = <T>(endpoint: string, sessionKey?: number) =>
  useQuery({
    queryKey: ["OPENF1", endpoint, sessionKey],
    queryFn: () => OpenF1.get<T[]>(endpoint, { params: { session_key: sessionKey } }),
    select: (response) => response.data,
    enabled: !!sessionKey,
    staleTime: PAST,
  });

export const useOpenF1Drivers = (sessionKey?: number) =>
  useSessionList<OpenF1Driver>("drivers", sessionKey);

export const useStints = (sessionKey?: number) => useSessionList<Stint>("stints", sessionKey);

export const useTeamRadio = (sessionKey?: number) =>
  useSessionList<TeamRadio>("team_radio", sessionKey);

export const useRaceControl = (sessionKey?: number) =>
  useSessionList<RaceControlMessage>("race_control", sessionKey);

export type TrackPoint = { x: number; y: number; sector: 0 | 1 | 2 };

// Draws the circuit from one car's position samples over a single lap,
// split into sectors with that lap's sector times.
export const useTrackOutline = (sessionKey?: number) =>
  useQuery({
    queryKey: ["OPENF1_TRACK_OUTLINE", sessionKey],
    queryFn: async (): Promise<TrackPoint[]> => {
      const laps = (
        await OpenF1.get<OpenF1Lap[]>("laps", { params: { session_key: sessionKey, lap_number: 5 } })
      ).data;
      const lap = laps.find(
        (l) =>
          l.date_start &&
          l.lap_duration &&
          l.duration_sector_1 &&
          l.duration_sector_2 &&
          !l.is_pit_out_lap
      );
      if (!lap?.date_start || !lap.lap_duration) return [];

      const start = moment.utc(lap.date_start);
      const sector2 = start.valueOf() + (lap.duration_sector_1 ?? 0) * 1000;
      const sector3 = sector2 + (lap.duration_sector_2 ?? 0) * 1000;
      const end = start.clone().add(lap.lap_duration, "seconds");

      const locations = (
        await OpenF1.get<CarLocation[]>("location", {
          params: {
            session_key: sessionKey,
            driver_number: lap.driver_number,
            "date>": start.toISOString(),
            "date<": end.toISOString(),
          },
        })
      ).data;

      return locations
        .filter((p) => p.x !== 0 || p.y !== 0)
        .map((p) => {
          const time = moment.utc(p.date).valueOf();
          return { x: p.x, y: p.y, sector: time < sector2 ? 0 : time < sector3 ? 1 : 2 };
        });
    },
    enabled: !!sessionKey,
    staleTime: PAST,
  });
