import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  title: string;
  value: string;
};

export const InfoItem = ({ title, value }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.light,
        padding: Theme.space.xs,
      }}
    >
      <Text
        variant="bodyLarge"
        style={{
          color: Theme.colors.light,
          fontFamily: Theme.fonts.bold,
          maxWidth: "40%",
        }}
      >
        {title}
      </Text>
      <Text
        variant="bodyLarge"
        style={{ color: Theme.colors.primary, fontFamily: Theme.fonts.bold }}
      >
        {value}
      </Text>
    </View>
  );
};
