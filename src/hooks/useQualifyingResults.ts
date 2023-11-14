import { QualifyingResults } from './../types';
import { useQuery } from "react-query";
import { Api } from "../api";

type Response = {
  MRData: {
    RaceTable: {
      season: "string";
      Races: QualifyingResults[];
    };
  };
};

type Props = {
  season: string;
  round: string;
};

export const useQualifyingResults = ({ season, round }: Props) => {
  return useQuery(
    ["QUALIFYING_RESULTS", season, round],
    () => Api.get<Response>(`${season}/${round}/qualifying.json`),
    {
      select: (response) => response.data,
    }
  );
};
