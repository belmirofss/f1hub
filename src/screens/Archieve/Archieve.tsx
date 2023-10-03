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
import { ArchieveDrivers } from "./ArchieveDrivers";
import { SectionContainer } from "../../components/SectionContainer";
import { ArchieveConstructors } from "./ArchieveConstructors";
import { ArchieveCalendar } from "./ArchieveCalendar";

export const Archieve = () => {
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedStandingType, setSelectedStandingType] = useState(
    StandingType.DRIVERS
  );

  const { data, isLoading, isError } = useSeasonsList();

  return (
    <ScreenContainer title="Archieve">
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
              <SectionContainer name="Standings" expansable startClosed>
                <SwitchDriverConstructor
                  selected={selectedStandingType}
                  onChange={setSelectedStandingType}
                />

                {selectedStandingType === StandingType.DRIVERS && (
                  <ArchieveDrivers season={selectedSeason} />
                )}

                {selectedStandingType === StandingType.CONSTRUCTORS && (
                  <ArchieveConstructors season={selectedSeason} />
                )}
              </SectionContainer>

              <SectionContainer name="Calendar" expansable startClosed>
                <ArchieveCalendar season={selectedSeason} />
              </SectionContainer>
            </>
          )}
        </>
      )}
    </ScreenContainer>
  );
};
