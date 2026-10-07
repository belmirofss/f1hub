import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { RaceLaps } from "../types";

type Response = {
  MRData: {
    total: string;
    RaceTable: {
      Races: RaceLaps[];
    };
  };
};

// Position of every driver at the end of every lap: driverId -> [lap 1, lap 2…]
export type LapPositions = Record<string, number[]>;

// One row per driver per lap, so a race is ~12 pages
export const useLapPositions = ({ season, round }: { season?: string; round?: string }) => {
  return useQuery({
    queryKey: ["LAP_POSITIONS", season, round],
    queryFn: async () => {
      const pages = await getAllPages<Response>(`${season}/${round}/laps.json`);
      const positions: LapPositions = {};
      let laps = 0;
      pages.forEach((page) =>
        page.MRData.RaceTable.Races[0]?.Laps?.forEach((lap) => {
          const index = Number(lap.number) - 1;
          laps = Math.max(laps, index + 1);
          lap.Timings.forEach((timing) => {
            positions[timing.driverId] ??= [];
            positions[timing.driverId][index] = Number(timing.position);
          });
        })
      );
      return { positions, laps };
    },
    enabled: !!season && !!round,
    staleTime: 1000 * 60 * 60,
  });
};
