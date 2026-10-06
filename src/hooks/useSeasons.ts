import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { Season } from "../types";

type Response = {
  MRData: {
    SeasonTable: {
      Seasons: Season[];
    };
  };
};

export const useSeasons = () => {
  return useQuery({
    queryKey: ["SEASONS_LIST"],
    queryFn: () => Api.get<Response>("seasons.json"),
    select: (response) => response.data.MRData.SeasonTable.Seasons,
  });
};
