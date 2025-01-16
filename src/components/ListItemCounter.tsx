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
        width: 36,
      }}
    >
      <Text
        variant="bodyMedium"
        style={{
          color: Theme.colors.primary,
          fontFamily: Theme.fonts.special,
        }}
      >
        {value.padStart(2, "0")}.
      </Text>
    </View>
  );
};
