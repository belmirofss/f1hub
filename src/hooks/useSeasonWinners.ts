import { useQuery } from "react-query";
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

// One request for the winner of every race in a season
export const useSeasonWinners = ({ season }: { season: string }) => {
  return useQuery(
    ["SEASON_WINNERS", season],
    () => Api.get<Response>(`${season}/results/1.json`),
    {
      select: (response) => response.data,
    }
  );
};
