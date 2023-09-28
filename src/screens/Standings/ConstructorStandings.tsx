import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { ConstructorStanding } from "../../types";
import { Theme } from "../../theme";

type Props = {
  constructorStandings: ConstructorStanding[];
};

export const ConstructorStandings = ({ constructorStandings }: Props) => {
  return constructorStandings.map((constructor) => (
    <List.Item
      key={constructor.Constructor.constructorId}
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
            {constructor.position.padStart(2, "0")}.
          </Text>
        </View>
      )}
      right={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="labelMedium"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.bold,
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
