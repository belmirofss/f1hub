import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SectionContainer } from "../../components/SectionContainer";
import { Theme } from "../../theme";
import { FlagIcon } from "../../components/FlagIcon";
import { ListItemResult } from "../../components/ListItemResult";
import { formatDate } from "../../helpers/formatDate";
import { useNavigation } from "@react-navigation/native";
import { useLastRaceResults } from "../../hooks/useLastRaceResults";

export const HomeLastRace = () => {
  const navigation = useNavigation();

  const { data, isLoading, isError } = useLastRaceResults();

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.Results || [];

  if (!race) return null;

  return (
    <SectionContainer
      name="LAST RACE"
      title={race?.raceName}
      description={race?.Circuit.circuitName}
      right={<FlagIcon country={race?.Circuit.Location.country} />}
      isLoading={isLoading}
      isError={isError}
    >
      {race && results && (
        <View style={{ marginTop: Theme.space.xs }}>
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.light,
              fontFamily: Theme.fonts.special,
              textAlign: "center",
            }}
          >
            {formatDate(race.date, race.time)}
          </Text>

          {results.slice(0, 10).map((result) => (
            <ListItemResult key={result.position} result={result} />
          ))}

          <Button
            mode="text"
            onPress={() =>
              navigation.navigate("RaceResult", {
                season: race.season,
                round: race.round,
                raceName: race.raceName,
              })
            }
          >
            <Text
              variant="labelSmall"
              style={{
                color: Theme.colors.primary,
                fontFamily: Theme.fonts.special,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              See details
            </Text>
          </Button>
        </View>
      )}
    </SectionContainer>
  );
};
