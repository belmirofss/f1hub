import { useMemo } from "react";
import { useSeasonResults } from "./useSeasonResults";
import { useSeasonQualifying } from "./useSeasonQualifying";
import { useSeasonDriverStandings } from "./useSeasonDriverStandings";
import { getTeammatePairs } from "../helpers/headToHead";

// Teammate battles for a season ("current" works too)
export const useTeammates = ({ season }: { season: string }) => {
  const results = useSeasonResults({ season });
  const qualifying = useSeasonQualifying({ season });
  const standings = useSeasonDriverStandings({ season });

  const pairs = useMemo(
    () =>
      getTeammatePairs(
        results.data ?? [],
        qualifying.data ?? [],
        standings.data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []
      ),
    [results.data, qualifying.data, standings.data]
  );

  return {
    pairs,
    isLoading: results.isLoading || qualifying.isLoading || standings.isLoading,
    isError: results.isError || qualifying.isError || standings.isError,
    refetch: () => {
      results.refetch();
      qualifying.refetch();
      standings.refetch();
    },
  };
};
