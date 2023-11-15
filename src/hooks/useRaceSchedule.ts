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
  round: string;
};

export const useRaceSchedule = ({ season, round }: Props) => {
  return useQuery(
    ["RACE_SCHEDULE", season, round],
    () => Api.get<Response>(`${season}/${round}.json`),
    {
      select: (response) => response.data,
    }
  );
};
