import { useQuery } from "react-query";
import { Api } from "../api";
import { ConstructorStanding } from "../types";

type Response = {
  MRData: {
    StandingsTable: {
      season: "string";
      StandingsLists: {
        season: string;
        round: string;
        ConstructorStandings: ConstructorStanding[];
      }[];
    };
  };
};

export const useCurrentConstructorStandings = () => {
  return useQuery(
    ["CURRENT_CONSTRUCTOR_STANDINGS"],
    () => Api.get<Response>("current/constructorStandings.json"),
    {
      select: (response) => response.data,
    }
  );
};
