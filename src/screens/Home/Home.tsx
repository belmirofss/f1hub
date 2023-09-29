import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { HomeNextRace } from "./HomeNextRace";
import { Theme } from "../../theme";
import { useLastRaceResults } from "../../hooks/useLastRaceResults";
import { HomeLastRace } from "./HomeLastRace";

export const Home = () => {
  const {
    data: driverStandings,
    isLoading: isLoadingDriverStandings,
    isError: isErrorDriverStandings,
  } = useCurrentDriverStandings();

  const {
    data: constructorStandings,
    isLoading: isLoadingConstructorStandings,
    isError: isErrorConstructorStandings,
  } = useCurrentConstructorStandings();

  const {
    data: currentRaceSchedule,
    isLoading: isLoadingCurrentRaceSchedule,
    isError: isErrorCurrentRaceSchedule,
  } = useCurrentRaceSchedule();

  const {
    data: lastRaceResults,
    isLoading: isLoadingRaceResults,
    isError: isErrorRaceResults,
  } = useLastRaceResults();

  if (
    isLoadingDriverStandings ||
    isLoadingConstructorStandings ||
    isLoadingCurrentRaceSchedule ||
    isLoadingRaceResults
  ) {
    return <Loading />;
  }

  if (
    isErrorDriverStandings ||
    isErrorConstructorStandings ||
    isErrorCurrentRaceSchedule ||
    isErrorRaceResults ||
    !driverStandings ||
    !constructorStandings ||
    !currentRaceSchedule ||
    !lastRaceResults
  ) {
    return <Error />;
  }

  return (
    <ScreenContainer title="Home">
      <View style={{ marginTop: Theme.space.xs }}>
        <HomeNextRace races={currentRaceSchedule.MRData.RaceTable.Races} />
      </View>

      <View style={{ marginTop: Theme.space.xs }}>
        <HomeLastRace
          race={lastRaceResults.MRData.RaceTable.Races[0]}
          results={lastRaceResults.MRData.RaceTable.Races[0].Results || []}
        />
      </View>
    </ScreenContainer>
  );
};
