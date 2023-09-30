import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { Race } from "../../types";
import { Theme } from "../../theme";
import moment from "moment-timezone";
import { ListItemCounter } from "../../components/ListItemCounter";
import { ListItemTitle } from "../../components/ListItemTitle";
import { ListItemDescription } from "../../components/ListItemDescription";
import { useTimezone } from "../../hooks/useTimezone";
import { FlagIcon } from "../../components/FlagIcon";
import { buildCountryFlagUrlByName } from "../../helpers/countries";

type Props = {
  race: Race;
};

export const CalendarRaceItem = ({ race }: Props) => {
  const timezone = useTimezone();

  return (
    <List.Item
      left={() => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ListItemCounter value={race.round} />
          <FlagIcon
            url={buildCountryFlagUrlByName(race.Circuit.Location.country)}
          />
        </View>
      )}
      title={
        <View>
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
          <ListItemTitle>{race.raceName}</ListItemTitle>
        </View>
      }
      description={
        <ListItemDescription>{race.Circuit.circuitName}</ListItemDescription>
      }
    />
  );
};
