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

export const useLastRaceResults = () => {
  return useQuery(
    ["LAST_RACE_RESULTS"],
    () => Api.get<Response>("current/last/results.json"),
    {
      select: (response) => response.data,
    }
  );
};
