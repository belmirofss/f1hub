import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Race, Result } from "../../types";
import { SectionContainer } from "../../components/SectionContainer";
import { Theme } from "../../theme";
import { FlagIcon } from "../../components/FlagIcon";
import { ListItemResult } from "../../components/ListItemResult";
import { formatDate } from "../../helpers/formatDate";
import { useNavigation } from "@react-navigation/native";

type Props = {
  race: Race;
  results: Result[];
};

export const HomeLastRace = ({ race, results }: Props) => {
  const navigation = useNavigation();

  return (
    <SectionContainer
      name="LAST RACE"
      title={race.raceName}
      description={race.Circuit.circuitName}
      right={<FlagIcon country={race.Circuit.Location.country} />}
    >
      <View style={{ marginTop: Theme.space.xs }}>
        <Text
          variant="labelSmall"
          style={{
            color: Theme.colors.light,
            fontFamily: Theme.fonts.special,
            textAlign: "center",
          }}
        >
          {formatDate(race.date, race.time)} - Podium
        </Text>

        {results.slice(0, 3).map((result) => (
          <ListItemResult key={result.position} result={result} />
        ))}

        <Button
          mode="text"
          onPress={() =>
            navigation.navigate("RaceResult", {
              season: race.season,
              round: race.round,
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
            See results
          </Text>
        </Button>
      </View>
    </SectionContainer>
  );
};
