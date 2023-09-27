import { useQuery } from "react-query";
import { Api } from "../api";
import { Race } from "../types";

type CurrentRaceScheduleResponse = {
    MRData: {
        RaceTable: {
            season: "string";
            Races: Race[]
        }
    }
}

export const useCurrentRaceSchedule = () => {
  return useQuery(["CURRENT_RACE_SCHEDULE"], () => Api.get<CurrentRaceScheduleResponse>("current.json", {
    params: {
      limit: 1000
    }
  }), {
    select: (response) => response.data,
  });
};