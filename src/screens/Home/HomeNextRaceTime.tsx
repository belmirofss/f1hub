import { View } from "react-native";
import { List, Text } from "react-native-paper";
import moment from "moment";
import { Theme } from "../../theme";

type Props = {
  title: string;
  date: string;
  time: string;
};

export const HomeNextRaceTime = ({ title, date, time }: Props) => {
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
            {moment(date).format("DD")}
          </Text>
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {moment(date).format("MMM")}
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
          {moment(time, "HH:mm:ss[Z]").format("HH:mm")}
        </Text>
      }
    />
  );
};
