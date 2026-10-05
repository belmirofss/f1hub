import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText } from "../../components/AppText";
import { useSettings } from "../../settings/SettingsContext";
import { findNextSession } from "../../helpers/sessions";
import { formatClock, formatDay } from "../../helpers/time";
import { Race } from "../../types";

type Props = {
  races: Race[];
  now: number;
  isLoading?: boolean;
};

const HEIGHT = 36;

// "● NEXT  PRACTICE 1 · SINGAPORE  FRI 09 10:30" strip under the header
export const NextSessionTicker = ({ races, now, isLoading }: Props) => {
  const navigation = useNavigation();
  const { accent, clock24 } = useSettings();
  const next = findNextSession(races, now);

  // Hold the space while loading so the page doesn't shift down
  if (isLoading) {
    return (
      <View
        style={{
          height: HEIGHT,
          borderRadius: Theme.radius.s,
          backgroundColor: Theme.colors.surface,
        }}
      />
    );
  }
  if (!next) return null;

  const { race, session } = next;
  const place = race.Circuit.Location.country.toUpperCase();
  const when = `${formatDay(session.start)}${session.hasTime ? ` ${formatClock(session.start, clock24)}` : ""}`;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("RaceWeekend", { season: race.season, round: race.round })
      }
      accessibilityRole="button"
      accessibilityLabel={`Next session: ${session.name}, ${race.raceName}, ${when}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        minHeight: HEIGHT,
        paddingHorizontal: 12,
        borderRadius: Theme.radius.s,
        backgroundColor: `${accent}1F`,
        borderWidth: 1,
        borderColor: `${accent}66`,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: accent,
          borderWidth: 2,
          borderColor: `${accent}55`,
        }}
      />
      <AppText mono size={11} color={accent} style={{ letterSpacing: 1 }}>
        NEXT
      </AppText>
      <AppText mono size={11} numberOfLines={1} style={{ flex: 1, letterSpacing: 1 }}>
        {session.name.toUpperCase()} · {place}
      </AppText>
      <AppText mono weight="bold" size={11} style={{ letterSpacing: 1 }}>
        {when}
      </AppText>
    </Pressable>
  );
};
