import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { DriverStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: {
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }[];
    };
  };
};

type Props = {
  season: string;
};

export const useSeasonDriverStandings = ({ season }: Props) => {
  return useQuery({
    queryKey: ["SEASON_DRIVER_STANDINGS", season],
    queryFn: () => Api.get<Response>(`${season}/driverStandings.json`),
    select: (response) => response.data,
  });
};
