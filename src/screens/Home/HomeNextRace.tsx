import moment from "moment";
import { HomeNextRaceTime } from "./HomeNextRaceTime";
import { SectionContainer } from "../../components/SectionContainer";
import { FlagIcon } from "../../components/FlagIcon";
import { convertToMoment } from "../../helpers/formatDate";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import React from "react";

export const HomeNextRace = () => {
  const { data, isLoading, isError } = useCurrentRaceSchedule();

  const nextRace = data?.MRData.RaceTable.Races.filter(
    (race) => convertToMoment(race.date, race.time) > moment()
  )[0];

  return (
    <SectionContainer
      name={nextRace || isLoading ? "NEXT RACE" : "NO RACE SCHEDULED"}
      title={nextRace?.raceName}
      description={nextRace?.Circuit.circuitName}
      right={<FlagIcon country={nextRace?.Circuit.Location.country} />}
      isLoading={isLoading}
      isError={isError}
    >
      {nextRace && (
        <>
          <HomeNextRaceTime
            title="Race"
            date={nextRace.date}
            time={nextRace.time}
          />

          {nextRace.Sprint && (
            <HomeNextRaceTime
              title="Sprint"
              date={nextRace.Sprint.date}
              time={nextRace.Sprint.time}
            />
          )}

          {nextRace.Qualifying && (
            <HomeNextRaceTime
              title="Qualifying"
              date={nextRace.Qualifying.date}
              time={nextRace.Qualifying.time}
            />
          )}

          {nextRace.SecondPractice && (
            <HomeNextRaceTime
              title="Practice 2"
              date={nextRace.SecondPractice.date}
              time={nextRace.SecondPractice.time}
            />
          )}

          {nextRace.FirstPractice && (
            <HomeNextRaceTime
              title="Practice 1"
              date={nextRace.FirstPractice.date}
              time={nextRace.FirstPractice.time}
            />
          )}
        </>
      )}
    </SectionContainer>
  );
};
