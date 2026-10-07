import { useQueries } from "@tanstack/react-query";
import { Api } from "../api";
import { DriverStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      StandingsLists: { season: string; DriverStandings: DriverStanding[] }[];
    };
  };
};

// Championship position in each of the given seasons (one small request each)
export const useDriverSeasonPositions = ({
  driverId,
  seasons,
}: {
  driverId: string;
  seasons: string[];
}) => {
  const queries = useQueries({
    queries: seasons.map((season) => ({
      queryKey: ["DRIVER_SEASON_STANDING", driverId, season],
      queryFn: () => Api.get<Response>(`${season}/drivers/${driverId}/driverStandings.json`),
      staleTime: 1000 * 60 * 30,
    })),
  });

  return {
    isLoading: queries.some((q) => q.isLoading),
    positions: seasons.map((season, index) => {
      const standing =
        queries[index].data?.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0];
      return { season, position: Number(standing?.position ?? 0) };
    }),
  };
};
