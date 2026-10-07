import { useQuery } from "@tanstack/react-query";
import { getAllPages } from "../api";
import { isClassified } from "../helpers/results";
import { Constructor, QualifyingResults, RaceResults, RaceSprintResults } from "../types";

type Response<R> = {
  MRData: {
    total: string;
    RaceTable: {
      Races: R[];
    };
  };
};

export type CareerRace = {
  season: string;
  round: string;
  raceName: string;
  position: number; // 0 = not classified
  positionText: string;
  grid: number;
  points: number;
  sprintPoints: number;
  sprintPosition?: number;
  Constructor: Constructor;
};

export type CareerSeason = {
  season: string;
  points: number;
  wins: number;
  team: Constructor;
};

export type Career = {
  races: CareerRace[]; // oldest first
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  seasons: CareerSeason[]; // oldest first
};

// A driver's whole career: race, sprint and qualifying results (3–10 pages)
export const useDriverCareer = ({ driverId }: { driverId: string }) => {
  return useQuery({
    queryKey: ["DRIVER_CAREER", driverId],
    queryFn: async (): Promise<Career> => {
      const [results, sprints, qualifying] = await Promise.all([
        getAllPages<Response<RaceResults>>(`drivers/${driverId}/results.json`),
        getAllPages<Response<RaceSprintResults>>(`drivers/${driverId}/sprint.json`),
        getAllPages<Response<QualifyingResults>>(`drivers/${driverId}/qualifying.json`),
      ]);

      const sprintByRound = new Map(
        sprints
          .flatMap((p) => p.MRData.RaceTable.Races)
          .map((race) => [`${race.season}-${race.round}`, race.SprintResults?.[0]])
      );

      const races: CareerRace[] = results
        .flatMap((p) => p.MRData.RaceTable.Races)
        .flatMap((race) => {
          const result = race.Results?.[0];
          if (!result) return [];
          const sprint = sprintByRound.get(`${race.season}-${race.round}`);
          return [
            {
              season: race.season,
              round: race.round,
              raceName: race.raceName,
              position: isClassified(result) ? Number(result.position) : 0,
              positionText: result.positionText,
              grid: Number(result.grid),
              points: Number(result.points),
              sprintPoints: Number(sprint?.points ?? 0),
              sprintPosition: sprint && isClassified(sprint) ? Number(sprint.position) : undefined,
              Constructor: result.Constructor,
            },
          ];
        });

      // The API's "qualifying/1" filter is unreliable, so count pole positions here
      const poles = qualifying
        .flatMap((p) => p.MRData.RaceTable.Races)
        .filter((race) => race.QualifyingResults?.[0]?.position === "1").length;

      const bySeason = new Map<string, CareerSeason>();
      races.forEach((race) => {
        const season = bySeason.get(race.season) ?? {
          season: race.season,
          points: 0,
          wins: 0,
          team: race.Constructor,
        };
        season.points += race.points + race.sprintPoints;
        season.wins += race.position === 1 ? 1 : 0;
        season.team = race.Constructor;
        bySeason.set(race.season, season);
      });

      return {
        races,
        starts: races.length,
        wins: races.filter((r) => r.position === 1).length,
        podiums: races.filter((r) => r.position >= 1 && r.position <= 3).length,
        poles,
        seasons: [...bySeason.values()],
      };
    },
    staleTime: 1000 * 60 * 30,
  });
};
