import { useQuery } from "react-query";
import { Api } from "../api";
import { Race } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      season: "string";
      Races: Race[];
    };
  };
};

type Props = {
  season: string;
};

export const useSeasonRaceSchedule = ({ season }: Props) => {
  return useQuery(
    ["SEASON_RACE_SCHEDULE", season],
    () => Api.get<Response>(`${season}.json`),
    {
      select: (response) => response.data,
    }
  );
};
