import { RaceBase } from "../types";

// Jolpica pages count rows, not races, so a page can end in the middle of a
// race. Joins the rows that belong to the same round back together.
export const mergeRaces = <R extends RaceBase, K extends keyof R>(races: R[], field: K): R[] => {
  const byRound = new Map<string, R>();
  races.forEach((race) => {
    const key = `${race.season}-${race.round}`;
    const rows = (race[field] as unknown[] | undefined) ?? [];
    const current = byRound.get(key);
    if (current) {
      (current[field] as unknown[]).push(...rows);
    } else {
      byRound.set(key, { ...race, [field]: [...rows] });
    }
  });
  return [...byRound.values()];
};
