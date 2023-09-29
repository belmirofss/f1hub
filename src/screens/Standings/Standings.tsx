import { View } from "react-native";
import { SegmentedButtons, configureFonts } from "react-native-paper";
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

  const standingsOptions = [
    {
      value: StandingType.DRIVERS,
      label: "Drivers",
    },
    {
      value: StandingType.CONSTRUCTORS,
      label: "Constructors",
    },
  ];

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
      title={`Standings for ${driverStandings.MRData.StandingsTable.season} season`}
    >
      <SegmentedButtons
        value={selectedStandingType}
        onValueChange={(value) =>
          setSelectedStandingType(value as StandingType)
        }
        buttons={standingsOptions.map((option) => ({
          ...option,
          labelStyle: {
            color:
              option.value === selectedStandingType
                ? Theme.colors.darken
                : Theme.colors.primary,
          },
        }))}
        style={{ marginTop: Theme.space.xs }}
        theme={{
          roundness: 2,
          colors: {
            secondaryContainer: Theme.colors.primary,
          },
          fonts: configureFonts({
            config: {
              fontFamily: Theme.fonts.bold,
            },
          }),
        }}
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
