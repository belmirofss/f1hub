import { View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSeasonsList } from "../../hooks/useSeasonsList";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { Picker } from "../../components/Picker";
import { Theme } from "../../theme";

export const Archieve = () => {
  const [selectedSeason, setSelectedSeason] = useState("");

  const { data, isLoading, isError } = useSeasonsList();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return (
    <ScreenContainer title="Archieve">
      <View style={{ marginTop: Theme.space.xs }}>
        <Picker
          label="Select the season"
          selected={selectedSeason}
          onSelection={setSelectedSeason}
          items={data.MRData.SeasonTable.Seasons.map((season) => ({
            text: `Season ${season.season}`,
            value: season.season,
          }))}
        />
      </View>
    </ScreenContainer>
  );
};
