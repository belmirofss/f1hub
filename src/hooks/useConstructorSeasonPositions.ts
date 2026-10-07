import { useQueries } from "@tanstack/react-query";
import { Api } from "../api";
import { ConstructorStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      StandingsLists: { season: string; ConstructorStandings: ConstructorStanding[] }[];
    };
  };
};

// Constructors' championship position in each of the given seasons
export const useConstructorSeasonPositions = ({
  constructorId,
  seasons,
}: {
  constructorId: string;
  seasons: string[];
}) => {
  const queries = useQueries({
    queries: seasons.map((season) => ({
      queryKey: ["CONSTRUCTOR_SEASON_STANDING", constructorId, season],
      queryFn: () =>
        Api.get<Response>(`${season}/constructors/${constructorId}/constructorStandings.json`),
      staleTime: 1000 * 60 * 30,
    })),
  });

  return {
    isLoading: queries.some((q) => q.isLoading),
    positions: seasons.map((season, index) => {
      const standing =
        queries[index].data?.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0];
      return { season, position: Number(standing?.position ?? 0) };
    }),
  };
};
