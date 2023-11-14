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

export const useSprintResults = ({ season, round }: Props) => {
  return useQuery(
    ["SPRINT_RESULTS", season, round],
    () => Api.get<Response>(`${season}/${round}/sprint.json`),
    {
      select: (response) => response.data,
    }
  );
};
