import { useQuery } from "react-query";
import { Api } from "../api";
import { DriverStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      season: "string";
      StandingsLists: {
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }[];
    };
  };
};

export const useCurrentDriverStandings = () => {
  return useQuery(
    ["CURRENT_DRIVER_STANDINGS"],
    () => Api.get<Response>("current/driverStandings.json"),
    {
      select: (response) => response.data,
    }
  );
};
