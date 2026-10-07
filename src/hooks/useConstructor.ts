import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { Constructor, Season } from "../types";

type Response = {
  MRData: {
    ConstructorTable: {
      Constructors: Constructor[];
    };
  };
};

type SeasonsResponse = {
  MRData: {
    SeasonTable: {
      Seasons: Season[];
    };
  };
};

type CountResponse = {
  MRData: {
    total: string;
  };
};

// Team info, the seasons it raced and its number of wins
export const useConstructor = ({ constructorId }: { constructorId: string }) => {
  return useQuery({
    queryKey: ["CONSTRUCTOR", constructorId],
    queryFn: async () => {
      const [info, seasons, wins] = await Promise.all([
        Api.get<Response>(`constructors/${constructorId}.json`),
        Api.get<SeasonsResponse>(`constructors/${constructorId}/seasons.json`),
        // Only the total is needed
        Api.get<CountResponse>(`constructors/${constructorId}/results/1.json`, {
          params: { limit: 1 },
        }),
      ]);
      return {
        constructor: info.data.MRData.ConstructorTable.Constructors[0],
        seasons: seasons.data.MRData.SeasonTable.Seasons.map((s) => s.season),
        wins: Number(wins.data.MRData.total),
      };
    },
    staleTime: 1000 * 60 * 60,
  });
};
