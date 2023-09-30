import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { useTimezone } from "../hooks/useTimezone";
import { ListItemCounter } from "./ListItemCounter";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByName } from "../helpers/countries";
import { Theme } from "../theme";
import moment from "moment";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";

export type Props = {
  round: string;
  country: string;
  date: string;
  time: string;
  raceName: string;
  circuitName: string;
};

export const ListItemRace = ({
  round,
  country,
  date,
  time,
  raceName,
  circuitName,
}: Props) => {
  const timezone = useTimezone();

  return (
    <List.Item
      left={() => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ListItemCounter value={round} />
          <FlagIcon url={buildCountryFlagUrlByName(country)} />
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
            {moment(`${date} ${time}`).tz(timezone).format("MMM DD[,] HH:mm")}
          </Text>
          <ListItemTitle>{raceName}</ListItemTitle>
        </View>
      }
      description={<ListItemDescription>{circuitName}</ListItemDescription>}
    />
  );
};
