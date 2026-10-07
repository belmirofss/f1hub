import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { mergeRaces } from "../helpers/pages";
import { RaceSprintResults } from "../types";

type Response = {
  MRData: {
    total: string;
    RaceTable: {
      Races: RaceSprintResults[];
    };
  };
};

// Every sprint result of a season (empty before 2021)
export const useSeasonSprintResults = ({ season }: { season?: string }) => {
  return useQuery({
    queryKey: ["SEASON_SPRINT_RESULTS", season],
    queryFn: async () => {
      const pages = await getAllPages<Response>(`${season}/sprint.json`);
      return mergeRaces(pages.flatMap((p) => p.MRData.RaceTable.Races), "SprintResults");
    },
    enabled: !!season,
    staleTime: 1000 * 60 * 30,
  });
};
