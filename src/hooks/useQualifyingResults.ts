import { QualifyingResults } from './../types';
import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: QualifyingResults[];
    };
  };
};

type Props = {
  season?: string;
  round?: string;
};

export const useQualifyingResults = ({ season, round }: Props) => {
  return useQuery({
    queryKey: ["QUALIFYING_RESULTS", season, round],
    queryFn: () => Api.get<Response>(`${season}/${round}/qualifying.json`),
    select: (response) => response.data,
    enabled: !!season && !!round,
  });
};
