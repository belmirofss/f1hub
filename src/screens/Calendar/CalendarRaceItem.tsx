import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { Race } from "../../types";
import { Theme } from "../../theme";
import moment from "moment-timezone";
import { ListItemCounter } from "../../components/ListItemCounter";
import { ListItemTitle } from "../../components/ListItemTitle";
import { ListItemDescription } from "../../components/ListItemDescription";
import { useTimezone } from "../../hooks/useTimezone";

type Props = {
  race: Race;
};

export const CalendarRaceItem = ({ race }: Props) => {
  const timezone = useTimezone();

  return (
    <List.Item
      left={() => <ListItemCounter value={race.round} />}
      title={
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.darken,
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {moment(`${race.date} ${race.time}`)
              .tz(timezone)
              .format("MMM DD[,] HH:mm")}
          </Text>
        </View>
      }
      description={
        <View>
          <ListItemTitle>{race.raceName}</ListItemTitle>
          <ListItemDescription>{race.Circuit.circuitName}</ListItemDescription>
        </View>
      }
    />
  );
};
