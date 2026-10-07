import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { Circuit, Constructor, Driver } from "../types";
import { SearchIndex } from "../helpers/search";
import { useSeasons } from "./useSeasons";
import { useSeasonRaceSchedule } from "./useSeasonRaceSchedule";
import { useSeasonDriverStandings } from "./useSeasonDriverStandings";

type DriversPage = { MRData: { total: string; DriverTable: { Drivers: Driver[] } } };
type ConstructorsPage = { MRData: { total: string; ConstructorTable: { Constructors: Constructor[] } } };
type CircuitsPage = { MRData: { total: string; CircuitTable: { Circuits: Circuit[] } } };

// The full lists only grow between seasons, so keep them for the whole app session
const LISTS = { staleTime: Infinity, gcTime: Infinity };

export const useSearchIndex = (year?: string) => {
  const drivers = useQuery({
    queryKey: ["ALL_DRIVERS"],
    queryFn: async () =>
      (await getAllPages<DriversPage>("drivers.json")).flatMap((p) => p.MRData.DriverTable.Drivers),
    ...LISTS,
  });
  const constructors = useQuery({
    queryKey: ["ALL_CONSTRUCTORS"],
    queryFn: async () =>
      (await getAllPages<ConstructorsPage>("constructors.json")).flatMap(
        (p) => p.MRData.ConstructorTable.Constructors
      ),
    ...LISTS,
  });
  const circuits = useQuery({
    queryKey: ["ALL_CIRCUITS"],
    queryFn: async () =>
      (await getAllPages<CircuitsPage>("circuits.json")).flatMap((p) => p.MRData.CircuitTable.Circuits),
    ...LISTS,
  });
  const seasons = useSeasons();
  const schedule = useSeasonRaceSchedule({ season: "current" });
  const standings = useSeasonDriverStandings({ season: "current" });
  const yearSchedule = useSeasonRaceSchedule({ season: year ?? "", enabled: !!year });

  const index = useMemo<SearchIndex>(() => {
    const currentTeams = new Map<string, Constructor>();
    standings.data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.forEach((s) => {
      const team = s.Constructors[s.Constructors.length - 1];
      if (team) currentTeams.set(s.Driver.driverId, team);
    });
    return {
      drivers: drivers.data ?? [],
      constructors: constructors.data ?? [],
      circuits: circuits.data ?? [],
      seasons: (seasons.data ?? []).map((s) => s.season),
      currentSeason: schedule.data?.MRData.RaceTable.season,
      currentTeams,
      currentRaces: schedule.data?.MRData.RaceTable.Races ?? [],
      yearRaces: yearSchedule.data?.MRData.RaceTable.Races ?? [],
    };
  }, [drivers.data, constructors.data, circuits.data, seasons.data, schedule.data, standings.data, yearSchedule.data]);

  const isLoading =
    drivers.isLoading || constructors.isLoading || circuits.isLoading || seasons.isLoading || yearSchedule.isLoading;
  const isError = drivers.isError || constructors.isError || circuits.isError || seasons.isError;
  const refetch = () => {
    if (drivers.isError) drivers.refetch();
    if (constructors.isError) constructors.refetch();
    if (circuits.isError) circuits.refetch();
    if (seasons.isError) seasons.refetch();
  };

  return { index, isLoading, isError, refetch };
};
