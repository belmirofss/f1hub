import { RaceResults } from './../types';
import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: RaceResults[];
    };
  };
};

type Props = {
  season?: string;
  round?: string;
};

export const useRaceResults = ({ season, round }: Props) => {
  return useQuery({
    queryKey: ["RACE_RESULTS", season, round],
    queryFn: () => Api.get<Response>(`${season}/${round}/results.json`),
    select: (response) => response.data,
    enabled: !!season && !!round,
  });
};
