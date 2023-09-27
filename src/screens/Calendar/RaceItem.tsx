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
      style={{
        marginHorizontal: -14, // removes the left padding of the list item component
      }}
      title={() => (
        <View style={{}}>
          <Text variant="labelSmall" style={{ color: Theme.colors.secondary }}>
            ROUND {race.round}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.bold,
            }}
          >
            {firstPractiseDay} - {raceDay}
          </Text>
        </View>
      )}
      titleStyle={{
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.primary,
      }}
    />
  );
};
