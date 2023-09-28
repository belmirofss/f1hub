import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { Race } from "../../types";
import { Theme } from "../../theme";
import moment from "moment";

type Props = {
  race: Race;
};

export const RaceItem = ({ race }: Props) => {
  const firstPractiseDay = moment(race.FirstPractice.date)
    .format("MMM DD")
    .toUpperCase();
  const raceDay = moment(race.date).format("MMM DD").toUpperCase();

  return (
    <List.Item
      left={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: Theme.colors.light,
              fontFamily: Theme.fonts.bold,
            }}
          >
            {race.round.padStart(2, "0")}.
          </Text>
        </View>
      )}
      title={
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.darken,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.bold,
            }}
          >
            {firstPractiseDay} - {raceDay}
          </Text>
        </View>
      }
      description={
        <View>
          <Text
            variant="bodyLarge"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.bold,
            }}
          >
            {race.raceName}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.regular,
            }}
          >
            {race.Circuit.circuitName}
          </Text>
        </View>
      }
    />
  );
};
