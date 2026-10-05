import { Moment } from "moment-timezone";
import { Race, SessionTime } from "../types";
import { toMoment } from "./time";

export type SessionKey =
  | "fp1"
  | "fp2"
  | "fp3"
  | "sprintQualifying"
  | "sprint"
  | "qualifying"
  | "race";

export type Session = {
  key: SessionKey;
  name: string;
  short: string;
  start: Moment;
  hasTime: boolean;
};

const SESSION_FIELDS: {
  key: SessionKey;
  name: string;
  short: string;
  pick: (race: Race) => SessionTime | undefined;
}[] = [
  { key: "fp1", name: "Practice 1", short: "FP1", pick: (r) => r.FirstPractice },
  { key: "fp2", name: "Practice 2", short: "FP2", pick: (r) => r.SecondPractice },
  { key: "fp3", name: "Practice 3", short: "FP3", pick: (r) => r.ThirdPractice },
  {
    key: "sprintQualifying",
    name: "Sprint Qualifying",
    short: "SQ",
    pick: (r) => r.SprintQualifying ?? r.SprintShootout,
  },
  { key: "sprint", name: "Sprint", short: "SPRINT", pick: (r) => r.Sprint },
  { key: "qualifying", name: "Qualifying", short: "QUALI", pick: (r) => r.Qualifying },
  { key: "race", name: "Race", short: "RACE", pick: (r) => r },
];

export const getSessions = (race: Race): Session[] =>
  SESSION_FIELDS.flatMap(({ key, name, short, pick }) => {
    const value = pick(race);
    if (!value?.date) return [];
    return [{ key, name, short, start: toMoment(value.date, value.time), hasTime: !!value.time }];
  }).sort((a, b) => a.start.valueOf() - b.start.valueOf());

export const getRaceStart = (race: Race) => toMoment(race.date, race.time);

export const getWeekendStart = (race: Race) => {
  const sessions = getSessions(race);
  return sessions[0]?.start ?? getRaceStart(race);
};

export const isSprintWeekend = (race: Race) => !!race.Sprint;

// Races in a season whose start is still ahead (with a 3h buffer so a race
// stays "next" while it's running).
export const findNextRace = (races: Race[], now: number) =>
  races.find((race) => getRaceStart(race).valueOf() + 3 * 3600000 > now);

export const findNextSession = (races: Race[], now: number) => {
  for (const race of races) {
    const session = getSessions(race).find((s) => s.start.valueOf() > now);
    if (session) return { race, session };
  }
};
