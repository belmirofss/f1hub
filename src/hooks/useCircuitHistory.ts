import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { RaceResults } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      Races: RaceResults[];
    };
  };
};

// Every race held at a circuit with its winner, plus each race's fastest lap
export const useCircuitHistory = ({ circuitId }: { circuitId: string }) => {
  return useQuery({
    queryKey: ["CIRCUIT_HISTORY", circuitId],
    queryFn: async () => {
      const [winners, fastest] = await Promise.all([
        Api.get<Response>(`circuits/${circuitId}/results/1.json`),
        Api.get<Response>(`circuits/${circuitId}/fastest/1/results.json`),
      ]);
      return {
        races: winners.data.MRData.RaceTable.Races,
        fastestLaps: fastest.data.MRData.RaceTable.Races,
      };
    },
    staleTime: 1000 * 60 * 60,
  });
};
