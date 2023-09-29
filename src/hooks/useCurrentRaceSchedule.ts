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

export const useCurrentRaceSchedule = () => {
  return useQuery(
    ["CURRENT_RACE_SCHEDULE"],
    () => Api.get<Response>("current.json"),
    {
      select: (response) => response.data,
    }
  );
};
