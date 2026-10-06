import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { RaceResults } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: RaceResults[];
    };
  };
};

export const useLastRaceResults = () => {
  return useQuery({
    queryKey: ["LAST_RACE_RESULTS"],
    queryFn: () => Api.get<Response>("current/last/results.json"),
    select: (response) => response.data,
  });
};
