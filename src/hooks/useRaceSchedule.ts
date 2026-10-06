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
  season?: string;
  round?: string;
};

export const useRaceSchedule = ({ season, round }: Props) => {
  return useQuery({
    queryKey: ["RACE_SCHEDULE", season, round],
    queryFn: () => Api.get<Response>(`${season}/${round}.json`),
    select: (response) => response.data,
    enabled: !!season && !!round,
  });
};
