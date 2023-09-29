import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { HomeNextRace } from "./HomeNextRace";
import { Theme } from "../../theme";

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

  if (
    isLoadingDriverStandings ||
    isLoadingConstructorStandings ||
    isLoadingCurrentRaceSchedule
  ) {
    return <Loading />;
  }

  if (
    isErrorDriverStandings ||
    isErrorConstructorStandings ||
    isErrorCurrentRaceSchedule ||
    !driverStandings ||
    !constructorStandings ||
    !currentRaceSchedule
  ) {
    return <Error />;
  }

  return (
    <ScreenContainer title="Home">
      <View style={{ marginTop: Theme.space.xs }}>
        <HomeNextRace races={currentRaceSchedule.MRData.RaceTable.Races} />
      </View>
    </ScreenContainer>
  );
};
