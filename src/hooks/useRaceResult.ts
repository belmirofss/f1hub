import { RaceResults } from './../types';
import { useQuery } from "react-query";
import { Api } from "../api";

type Response = {
  MRData: {
    RaceTable: {
      season: "string";
      Races: RaceResults[];
    };
  };
};

type Props = {
  season: string;
  round: string;
};

export const useRaceResults = ({ season, round }: Props) => {
  return useQuery(
    ["RACE_RESULTS", season, round],
    () => Api.get<Response>(`${season}/${round}/results.json`),
    {
      select: (response) => response.data,
    }
  );
};
