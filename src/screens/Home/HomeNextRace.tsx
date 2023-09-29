import { Race } from "../../types";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";
import moment from "moment";
import { HomeNextRaceTime } from "./HomeNextRaceTime";
import { HomeSection } from "./HomeSection";
import { HomeSectionName } from "./HomeSectionName";

type Props = {
  races: Race[];
};

export const HomeNextRace = ({ races }: Props) => {
  const nextRace = races.filter(
    (race) => moment(`${race.date} ${race.time}`) > moment()
  )[0];

  if (!nextRace) {
    return <HomeSectionName>NO NEXT RACE</HomeSectionName>;
  }

  return (
    <HomeSection
      name="NEXT RACE"
      title={nextRace.raceName}
      description={nextRace.Circuit.circuitName}
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
    </HomeSection>
  );
};
