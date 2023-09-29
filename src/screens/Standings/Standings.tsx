import { View } from "react-native";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useState } from "react";
import { StandingType } from "../../types";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";
import { Theme } from "../../theme";
import { StandingsDrivers } from "./StandingsDrivers";
import { StandingsContructors } from "./StandingsContructors";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";
import { SwitchDriverConstructor } from "../../components/SwitchDriverConstructor";

export const Standings = () => {
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

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

  if (isLoadingDriverStandings || isLoadingConstructorStandings) {
    return <Loading />;
  }

  if (
    isErrorDriverStandings ||
    isErrorConstructorStandings ||
    !driverStandings ||
    !constructorStandings
  ) {
    return <Error />;
  }

  return (
    <ScreenContainer
      title={`Season ${driverStandings.MRData.StandingsTable.season} standings`}
    >
      <SwitchDriverConstructor
        selected={selectedStandingType}
        onChange={setSelectedStandingType}
      />

      <View style={{ marginTop: Theme.space.xs }}>
        {selectedStandingType === StandingType.DRIVERS && (
          <StandingsDrivers
            driverStandings={
              driverStandings.MRData.StandingsTable.StandingsLists[0]
                .DriverStandings
            }
          />
        )}

        {selectedStandingType === StandingType.CONSTRUCTORS && (
          <StandingsContructors
            constructorStandings={
              constructorStandings.MRData.StandingsTable.StandingsLists[0]
                .ConstructorStandings
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
};
