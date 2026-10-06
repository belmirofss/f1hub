import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { ConstructorStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: {
        season: string;
        round: string;
        ConstructorStandings: ConstructorStanding[];
      }[];
    };
  };
};

type Props = {
  season: string;
};

export const useSeasonConstructorStandings = ({ season }: Props) => {
  return useQuery({
    queryKey: ["SEASON_CONSTRUCTOR_STANDINGS", season],
    queryFn: () => Api.get<Response>(`${season}/constructorStandings.json`),
    select: (response) => response.data,
  });
};
