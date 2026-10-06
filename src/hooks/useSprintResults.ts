import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { RaceSprintResults } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      season: string;
      Races: RaceSprintResults[];
    };
  };
};

type Props = {
  season?: string;
  round?: string;
};

export const useSprintResults = ({ season, round }: Props) => {
  return useQuery({
    queryKey: ["SPRINT_RESULTS", season, round],
    queryFn: () => Api.get<Response>(`${season}/${round}/sprint.json`),
    select: (response) => response.data,
    enabled: !!season && !!round,
  });
};
