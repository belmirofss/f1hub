import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { Race } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
};

type Props = {
  season: string;
};

export const useSeasonRaceSchedule = ({ season }: Props) => {
  return useQuery({
    queryKey: ["SEASON_RACE_SCHEDULE", season],
    queryFn: () => Api.get<Response>(`${season}.json`),
    select: (response) => response.data,
  });
};
