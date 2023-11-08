import { View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSeasonsList } from "../../hooks/useSeasonsList";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
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
    <ScreenContainer title="Archive">
      {isLoading ? (
        <Loading />
      ) : isError || !data ? (
        <Error />
      ) : (
        <>
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
              <SectionContainer name="Standings" expansable>
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

              <SectionContainer name="Calendar" expansable>
                <ArchiveCalendar season={selectedSeason} />
              </SectionContainer>
            </>
          )}
        </>
      )}
    </ScreenContainer>
  );
};
