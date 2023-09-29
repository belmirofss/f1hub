import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  points: string;
};

export const ListItemPts = ({ points }: Props) => {
  return (
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
        {points} PTS
      </Text>
    </View>
  );
};
