import { useState } from "react";
import { View } from "react-native";
import { SwitchDriverConstructor } from "../../components/SwitchDriverConstructor";
import { ConstructorStanding, DriverStanding, StandingType } from "../../types";
import { SectionContainer } from "../../components/SectionContainer";
import { ListItemDriver } from "../../components/ListItemDriver";
import { ListItemConstructor } from "../../components/ListItemConstructor";

type Props = {
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
};

export const HomeStandings = ({
  driverStandings,
  constructorStandings,
}: Props) => {
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

  return (
    <SectionContainer name="STANDINGS">
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
    </SectionContainer>
  );
};
