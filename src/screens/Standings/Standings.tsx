import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useState } from "react";
import { StandingType } from "../../types";
import { Theme } from "../../theme";
import { StandingsDrivers } from "./StandingsDrivers";
import { StandingsContructors } from "./StandingsContructors";
import { SwitchDriverConstructor } from "../../components/SwitchDriverConstructor";

export const Standings = () => {
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

  return (
    <ScreenContainer title="Standings">
      <SwitchDriverConstructor
        selected={selectedStandingType}
        onChange={setSelectedStandingType}
      />

      <View style={{ marginTop: Theme.space.xs }}>
        {selectedStandingType === StandingType.DRIVERS && <StandingsDrivers />}

        {selectedStandingType === StandingType.CONSTRUCTORS && (
          <StandingsContructors />
        )}
      </View>
    </ScreenContainer>
  );
};
