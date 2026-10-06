import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Api } from "../api";
import { RaceResults } from "../types";
import { isClassified } from "../helpers/results";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: RaceResults[];
    };
  };
};

// Finishing position per round, oldest first. 0 = did not finish, null = no entry.
export type Form = (number | null)[];

type Props = {
  season?: string;
  lastRound?: string;
  count?: number;
};

// Fetches the last few rounds (shared cache with useRaceResults) and builds
// per-driver and per-team form.
export const useRecentForm = ({ season, lastRound, count = 5 }: Props) => {
  const last = Number(lastRound ?? 0);
  const rounds = Array.from({ length: Math.min(count, last) }, (_, i) =>
    String(last - Math.min(count, last) + 1 + i)
  );

  const queries = useQueries({
    queries: rounds.map((round) => ({
      queryKey: ["RACE_RESULTS", season, round],
      queryFn: () => Api.get<Response>(`${season}/${round}/results.json`),
      enabled: !!season && last > 0,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const dataStamp = queries.map((q) => q.dataUpdatedAt).join(",");

  return useMemo(() => {
    const drivers: Record<string, Form> = {};
    const teams: Record<string, Form> = {};

    queries.forEach((query, index) => {
      const results = query.data?.data.MRData.RaceTable.Races[0]?.Results ?? [];

      results.forEach((result) => {
        const position = isClassified(result) ? Number(result.position) : 0;
        const driverId = result.Driver.driverId;
        const teamId = result.Constructor.constructorId;

        drivers[driverId] ??= Array(rounds.length).fill(null);
        drivers[driverId][index] = position;

        teams[teamId] ??= Array(rounds.length).fill(null);
        const best = teams[teamId][index];
        if (position > 0 && (best === null || best === 0 || position < best)) {
          teams[teamId][index] = position;
        } else if (best === null) {
          teams[teamId][index] = position;
        }
      });
    });

    return { drivers, teams, isLoading };
  }, [dataStamp, isLoading]);
};
