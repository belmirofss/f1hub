import { View } from "react-native";
import { Text } from "react-native-paper";
import { ListItemCounter } from "./ListItemCounter";
import { FlagIcon } from "./FlagIcon";
import { Theme } from "../theme";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "./ListItem";
import { useNavigation } from "@react-navigation/native";
import { useLastRaceResults } from "../hooks/useLastRaceResults";
import { Race } from "../types";
import { formatDate } from "../helpers/formatDate";

export type Props = {
  race: Race;
};

export const ListItemRace = ({ race }: Props) => {
  const navigation = useNavigation();

  const { data, isLoading, isError } = useLastRaceResults();

  if (isLoading || isError || !data) {
    return null;
  }

  const lastRace = data.MRData.RaceTable.Races[0];
  const season = Number(data.MRData.RaceTable.season);

  const olderSeason = Number(race.season) < season;
  const seasonIsAboutToStart = Boolean(
    Number(race.season) === season && !lastRace
  );
  const isFutureRace = Boolean(
    lastRace &&
      Number(race.season) === season &&
      Number(race.round) <= Number(lastRace.round)
  );

  const existResults = olderSeason || (!seasonIsAboutToStart && !isFutureRace);

  return (
    <ListItem
      onClick={() =>
        navigation.navigate(existResults ? "RaceResult" : "RaceSchedule", {
          season: race.season,
          round: race.round,
          raceName: race.raceName,
        })
      }
    >
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
            <ListItemCounter value={race.round} />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Theme.space.xs,
              }}
            >
              <FlagIcon country={race.Circuit.Location.country} />
              <Text
                variant="labelSmall"
                style={{
                  color: Theme.colors.secondary,
                  fontFamily: Theme.fonts.special,
                }}
              >
                {formatDate(race.date, race.time)}{" "}
              </Text>
            </View>

            <ListItemTitle>{race.raceName}</ListItemTitle>
            <ListItemDescription>
              {race.Circuit.circuitName}
            </ListItemDescription>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Theme.colors.light} />
      </View>
    </ListItem>
  );
};
