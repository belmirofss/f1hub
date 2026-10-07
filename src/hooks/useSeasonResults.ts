import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { mergeRaces } from "../helpers/pages";
import { RaceResults } from "../types";

type Response = {
  MRData: {
    total: string;
    RaceTable: {
      Races: RaceResults[];
    };
  };
};

// Every race result of a season (~5 pages)
export const useSeasonResults = ({ season }: { season?: string }) => {
  return useQuery({
    queryKey: ["SEASON_RESULTS", season],
    queryFn: async () => {
      const pages = await getAllPages<Response>(`${season}/results.json`);
      return mergeRaces(pages.flatMap((p) => p.MRData.RaceTable.Races), "Results");
    },
    enabled: !!season,
    staleTime: 1000 * 60 * 30,
  });
};
