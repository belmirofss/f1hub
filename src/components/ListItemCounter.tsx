import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  value: string;
};

export const ListItemCounter = ({ value }: Props) => {
  return (
    <View
      style={{
        justifyContent: "center",
        width: 40,
      }}
    >
      <Text
        variant="bodyLarge"
        style={{
          color: Theme.colors.light,
          fontFamily: Theme.fonts.special,
        }}
      >
        {value.padStart(2, "0")}.
      </Text>
    </View>
  );
};
