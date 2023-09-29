import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { Race } from "../../types";
import { Theme } from "../../theme";
import moment from "moment";
import { ListItemCounter } from "../../components/ListItemCounter";

type Props = {
  race: Race;
};

export const CalendarRaceItem = ({ race }: Props) => {
  const firstPractiseDay = moment(race.FirstPractice.date)
    .format("MMM DD")
    .toUpperCase();
  const raceDay = moment(race.date).format("MMM DD").toUpperCase();

  return (
    <List.Item
      left={() => <ListItemCounter value={race.round} />}
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
              fontFamily: Theme.fonts.special,
            }}
          >
            {firstPractiseDay} - {raceDay}
          </Text>
        </View>
      }
      description={
        <View>
          <Text
            variant="titleMedium"
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
            }}
          >
            {race.Circuit.circuitName}
          </Text>
        </View>
      }
    />
  );
};
