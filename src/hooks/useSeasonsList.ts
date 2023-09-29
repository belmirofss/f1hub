import { useQuery } from "react-query";
import { Api } from "../api";
import { Season } from "../types";

type Response = {
  MRData: {
    SeasonTable: {
      Seasons: Season[];
    };
  };
};

export const useSeasonsList = () => {
  return useQuery(["SEASONS_LIST"], () => Api.get<Response>("seasons.json"), {
    select: (response) => response.data,
  });
};
