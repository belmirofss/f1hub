import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { mergeRaces } from "../helpers/pages";
import { QualifyingResults } from "../types";

type Response = {
  MRData: {
    total: string;
    RaceTable: {
      Races: QualifyingResults[];
    };
  };
};

// Every qualifying result of a season (~5 pages)
export const useSeasonQualifying = ({ season }: { season?: string }) => {
  return useQuery({
    queryKey: ["SEASON_QUALIFYING", season],
    queryFn: async () => {
      const pages = await getAllPages<Response>(`${season}/qualifying.json`);
      return mergeRaces(pages.flatMap((p) => p.MRData.RaceTable.Races), "QualifyingResults");
    },
    enabled: !!season,
    staleTime: 1000 * 60 * 30,
  });
};
