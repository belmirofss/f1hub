import { View } from "react-native";
import React, { useState } from "react";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSeasonsList } from "../../hooks/useSeasonsList";
import { Picker } from "../../components/Picker";
import { Theme } from "../../theme";
import { StandingType } from "../../types";
import { SwitchDriverConstructor } from "../../components/SwitchDriverConstructor";
import { ArchiveDrivers } from "./ArchiveDrivers";
import { SectionContainer } from "../../components/SectionContainer";
import { ArchiveConstructors } from "./ArchiveConstructors";
import { ArchiveCalendar } from "./ArchiveCalendar";

export const Archive = () => {
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

  const { data, isLoading, isError } = useSeasonsList();

  return (
    <ScreenContainer title="Archive" isLoading={isLoading} isError={isError}>
      {data && (
        <React.Fragment>
          <View
            style={{ marginTop: Theme.space.xs, marginBottom: Theme.space.xs }}
          >
            <Picker
              label="Select the season"
              selected={selectedSeason}
              onSelection={setSelectedSeason}
              items={data.MRData.SeasonTable.Seasons.reverse().map(
                (season) => ({
                  text: `Season ${season.season}`,
                  value: season.season,
                })
              )}
            />
          </View>

          {selectedSeason && (
            <>
              <SectionContainer name="Standings">
                <SwitchDriverConstructor
                  selected={selectedStandingType}
                  onChange={setSelectedStandingType}
                />

                {selectedStandingType === StandingType.DRIVERS && (
                  <ArchiveDrivers season={selectedSeason} />
                )}

                {selectedStandingType === StandingType.CONSTRUCTORS && (
                  <ArchiveConstructors season={selectedSeason} />
                )}
              </SectionContainer>

              <SectionContainer name="Calendar">
                <ArchiveCalendar season={selectedSeason} />
              </SectionContainer>
            </>
          )}
        </React.Fragment>
      )}
    </ScreenContainer>
  );
};
