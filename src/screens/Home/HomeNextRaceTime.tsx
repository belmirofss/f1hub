import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { Theme } from "../../theme";
import { convertToMoment, getTimezone } from "../../helpers/formatDate";

type Props = {
  title: string;
  date: string;
  time?: string;
};

export const HomeNextRaceTime = ({ title, date, time }: Props) => {
  const momentDate = convertToMoment(date, time).tz(getTimezone());

  return (
    <List.Item
      left={() => (
        <View
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRightColor: Theme.colors.light,
            borderRightWidth: 1,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {momentDate.format("DD")}
          </Text>
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {momentDate.format("MMM")}
          </Text>
        </View>
      )}
      title={
        <Text
          variant="bodyLarge"
          style={{ color: Theme.colors.primary, fontFamily: Theme.fonts.bold }}
        >
          {title}
        </Text>
      }
      description={
        <Text
          variant="bodyLarge"
          style={{
            color: Theme.colors.primary,
          }}
        >
          {momentDate.format("HH:mm")}
        </Text>
      }
    />
  );
};
