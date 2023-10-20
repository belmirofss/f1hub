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
    year: string;
    round: string;
}

export const useRaceResults = ({ year, round }: Props) => {
  return useQuery(
    ["RACE_RESULTS", year, round],
    () => Api.get<Response>(`${year}/${round}/results.json`),
    {
      select: (response) => response.data,
    }
  );
};
