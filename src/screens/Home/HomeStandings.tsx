import { useState } from "react";
import { View } from "react-native";
import { SwitchDriverConstructor } from "../../components/SwitchDriverConstructor";
import { ConstructorStanding, DriverStanding, StandingType } from "../../types";
import { SectionContainer } from "../../components/SectionContainer";
import { ListItemDriver } from "../../components/ListItemDriver";
import { ListItemConstructor } from "../../components/ListItemConstructor";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";

export const HomeStandings = () => {
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

  const {
    data: driverStandingsData,
    isLoading: isLoadingDriverStandings,
    isError: isErrorDriverStandings,
  } = useCurrentDriverStandings();

  const {
    data: constructorStandingsData,
    isLoading: isLoadingConstructorStandings,
    isError: isErrorConstructorStandings,
  } = useCurrentConstructorStandings();

  const driverStandings =
    driverStandingsData?.MRData.StandingsTable.StandingsLists[0]
      .DriverStandings;

  const constructorStandings =
    constructorStandingsData?.MRData.StandingsTable.StandingsLists[0]
      .ConstructorStandings;

  return (
    <SectionContainer
      name="STANDINGS"
      isLoading={isLoadingDriverStandings || isLoadingConstructorStandings}
      isError={isErrorDriverStandings || isErrorConstructorStandings}
    >
      {driverStandings && constructorStandings && (
        <View>
          <SwitchDriverConstructor
            selected={selectedStandingType}
            onChange={setSelectedStandingType}
          />

          {selectedStandingType === StandingType.DRIVERS &&
            driverStandings
              .slice(0, 3)
              .map((driver) => (
                <ListItemDriver
                  key={driver.Driver.driverId}
                  position={driver.position}
                  points={driver.points}
                  driver={driver.Driver}
                  constructorName={driver.Constructors.map(
                    (constructor) => constructor.name
                  ).join(" - ")}
                />
              ))}

          {selectedStandingType === StandingType.CONSTRUCTORS &&
            constructorStandings
              .slice(0, 3)
              .map((constructor) => (
                <ListItemConstructor
                  key={constructor.Constructor.constructorId}
                  position={constructor.position}
                  points={constructor.points}
                  konstructor={constructor.Constructor}
                />
              ))}
        </View>
      )}
    </SectionContainer>
  );
};
