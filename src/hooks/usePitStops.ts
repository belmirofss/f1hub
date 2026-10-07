import { useQuery } from "@tanstack/react-query";
import { Api } from "../api";
import { RacePitStops } from "../types";

type Response = {
  MRData: {
    RaceTable: {
      Races: RacePitStops[];
    };
  };
};

// Pit lane times, available from 2011
export const usePitStops = ({ season, round }: { season?: string; round?: string }) => {
  return useQuery({
    queryKey: ["PIT_STOPS", season, round],
    queryFn: () => Api.get<Response>(`${season}/${round}/pitstops.json`),
    select: (response) => response.data.MRData.RaceTable.Races[0]?.PitStops ?? [],
    enabled: !!season && !!round,
    staleTime: 1000 * 60 * 60,
  });
};
