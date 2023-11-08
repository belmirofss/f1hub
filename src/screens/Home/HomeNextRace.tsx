import { Race } from "../../types";
import moment from "moment";
import { HomeNextRaceTime } from "./HomeNextRaceTime";
import { SectionContainer } from "../../components/SectionContainer";
import { SectionTitle } from "../../components/SectionTitle";
import { FlagIcon } from "../../components/FlagIcon";
import { convertToMoment } from "../../helpers/formatDate";

type Props = {
  races: Race[];
};

export const HomeNextRace = ({ races }: Props) => {
  const nextRace = races.filter(
    (race) => convertToMoment(race.date, race.time) > moment()
  )[0];

  if (!nextRace) {
    return <SectionTitle>NO NEXT RACE</SectionTitle>;
  }

  return (
    <SectionContainer
      name="NEXT RACE"
      title={nextRace.raceName}
      description={nextRace.Circuit.circuitName}
      right={<FlagIcon country={nextRace.Circuit.Location.country} />}
    >
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

        <HomeNextRaceTime
          title="Qualifying"
          date={nextRace.Qualifying.date}
          time={nextRace.Qualifying.time}
        />

        {!nextRace.Sprint && (
          <HomeNextRaceTime
            title="Practice 2"
            date={nextRace.SecondPractice.date}
            time={nextRace.SecondPractice.time}
          />
        )}

        <HomeNextRaceTime
          title="Practice 1"
          date={nextRace.FirstPractice.date}
          time={nextRace.FirstPractice.time}
        />
      </>
    </SectionContainer>
  );
};
