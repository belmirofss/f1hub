import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useTimezone } from "../hooks/useTimezone";
import { ListItemCounter } from "./ListItemCounter";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByName } from "../helpers/countries";
import { Theme } from "../theme";
import moment from "moment";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "./ListItem";

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
    <ListItem onClick={() => {}}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: Theme.space.xs,
        }}
      >
        <View style={{ flexDirection: "row", gap: Theme.space.xs }}>
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
            <ListItemDescription>{circuitName}</ListItemDescription>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Theme.colors.light} />
      </View>
    </ListItem>
  );
};
