import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  time?: string;
  status?: string;
};

export const ListItemTime = ({ time, status }: Props) => {
  const timeAlternative = status?.includes("Lap") ? status : "DNF";

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Text
        variant="bodySmall"
        style={{
          color: Theme.colors.secondary,
          fontFamily: Theme.fonts.special,
        }}
      >
        {time ?? timeAlternative}
      </Text>
    </View>
  );
};
