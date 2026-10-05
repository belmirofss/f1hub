import { useState } from "react";
import { Screen } from "../../components/Screen";
import { Segmented } from "../../components/Segmented";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_STANDINGS_DRIVERS_ID } from "../../constants";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";
import { StandingType } from "../../types";
import { StandingsTable } from "./StandingsTable";

export const Standings = () => {
  const [type, setType] = useState(StandingType.DRIVERS);
  const drivers = useSeasonDriverStandings({ season: "current" });
  const schedule = useSeasonRaceSchedule({ season: "current" });

  const round = Number(drivers.data?.MRData.StandingsTable.StandingsLists[0]?.round ?? 0);
  const total = schedule.data?.MRData.RaceTable.Races.length ?? 0;
  const remaining = total - round;

  return (
    <Screen
      title="Standings"
      meta={
        // Shown once both requests are in, so "· 7 TO GO" doesn't appear late
        round && !schedule.isLoading
          ? `AFTER R${round}${remaining > 0 ? ` · ${remaining} TO GO` : ""}`
          : undefined
      }
      header={
        <Segmented
          value={type}
          onChange={setType}
          options={[
            { value: StandingType.DRIVERS, label: "Drivers" },
            { value: StandingType.CONSTRUCTORS, label: "Constructors" },
          ]}
        />
      }
    >
      <StandingsTable season="current" type={type} />
      <AdBanner adUnitId={AD_BANNER_STANDINGS_DRIVERS_ID} />
    </Screen>
  );
};
