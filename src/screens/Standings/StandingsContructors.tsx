import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { ConstructorStanding } from "../../types";
import { Theme } from "../../theme";
import { ListItemCounter } from "../../components/ListItemCounter";

type Props = {
  constructorStandings: ConstructorStanding[];
};

export const StandingsContructors = ({ constructorStandings }: Props) => {
  return constructorStandings.map((constructor) => (
    <List.Item
      key={constructor.Constructor.constructorId}
      left={() => <ListItemCounter value={constructor.position} />}
      right={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {constructor.points} PTS
          </Text>
        </View>
      )}
      title={
        <Text
          variant="bodyLarge"
          style={{
            color: Theme.colors.primary,
            fontFamily: Theme.fonts.bold,
          }}
        >
          {constructor.Constructor.name}
        </Text>
      }
    />
  ));
};
