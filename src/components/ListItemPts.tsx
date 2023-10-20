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
        alignItems: "flex-end",
        width: 52,
      }}
    >
      <Text
        variant="labelSmall"
        style={{
          color: Theme.colors.secondary,
          fontFamily: Theme.fonts.special,
          textAlign: "right",
        }}
      >
        {points}
      </Text>
      <Text
        variant="labelSmall"
        style={{
          color: Theme.colors.secondary,
          fontFamily: Theme.fonts.special,
          textAlign: "right",
        }}
      >
        PTS
      </Text>
    </View>
  );
};
