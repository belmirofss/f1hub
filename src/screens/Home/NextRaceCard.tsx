import { useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Segmented } from "../../components/Segmented";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { findNextRace, getSessions, isSprintWeekend } from "../../helpers/sessions";
import { getCircuitTimezone } from "../../helpers/circuits";
import { getCountryCode3ByName } from "../../helpers/countries";
import { formatClock, formatDay, splitDuration } from "../../helpers/time";
import { Race } from "../../types";

type Props = {
  races: Race[];
  now: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const NextRaceCard = ({ races, now, isLoading, isError, onRetry }: Props) => {
  const navigation = useNavigation();
  const { accent, clock24 } = useSettings();
  const [zone, setZone] = useState<"mine" | "track">("mine");

  if (isLoading) return <Card><Loading /></Card>;
  if (isError) return <Card><Error onRetry={onRetry} /></Card>;

  const race = findNextRace(races, now);

  if (!race) {
    return (
      <Card>
        <Label>SEASON COMPLETE</Label>
        <AppText size={20} weight="bold">
          No more races this season
        </AppText>
        <AppText color={Theme.colors.muted}>
          Relive the season in the Archive while the next calendar is announced.
        </AppText>
      </Card>
    );
  }

  const sessions = getSessions(race);
  const raceStart = sessions[sessions.length - 1].start;
  const trackZone = getCircuitTimezone(race.Circuit.circuitId);
  const timezone = zone === "track" ? trackZone : undefined;
  const { days, hours, minutes } = splitDuration(raceStart.valueOf() - now);
  const started = raceStart.valueOf() <= now;

  return (
    <Card style={{ gap: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Label>
          NEXT RACE · R{race.round}/{races.length}
        </Label>
        {isSprintWeekend(race) && (
          <View style={{ backgroundColor: Theme.colors.sprint, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 }}>
            <AppText mono weight="bold" size={11} color={Theme.colors.background}>
              SPRINT
            </AppText>
          </View>
        )}
      </View>

      <View>
        <AppText size={26} weight="bold" style={{ lineHeight: 30 }}>
          {race.raceName}
        </AppText>
        <AppText size={14} color={Theme.colors.muted}>
          {race.Circuit.circuitName} · {getCountryCode3ByName(race.Circuit.Location.country)}
        </AppText>
      </View>

      {started ? (
        <View style={{ backgroundColor: `${accent}1F`, borderRadius: Theme.radius.m, padding: 12 }}>
          <AppText weight="bold" size={16}>
            Lights out — the race is underway
          </AppText>
        </View>
      ) : (
        <View
          accessible
          accessibilityLabel={`Race starts in ${days} days, ${hours} hours and ${minutes} minutes`}
          style={{ flexDirection: "row", gap: 8 }}
        >
          {[
            { value: days, label: "DAYS" },
            { value: hours, label: "HRS" },
            { value: minutes, label: "MIN" },
          ].map((cell) => (
            <View
              key={cell.label}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: Theme.radius.m,
                backgroundColor: Theme.colors.background,
              }}
            >
              <AppText mono weight="bold" size={34} style={{ lineHeight: 38 }}>
                {pad(cell.value)}
              </AppText>
              <AppText mono size={10} color={Theme.colors.muted} style={{ letterSpacing: 1.5 }}>
                {cell.label}
              </AppText>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: 2 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <AppText size={12} weight="bold" color={Theme.colors.muted} style={{ letterSpacing: 1 }}>
            SESSIONS
          </AppText>
          {trackZone && (
            <Segmented
              size="small"
              value={zone}
              onChange={setZone}
              options={[
                { value: "mine", label: "My time" },
                { value: "track", label: "Track" },
              ]}
            />
          )}
        </View>
        {sessions.map((session) => {
          const isRace = session.key === "race";
          const color = isRace ? accent : Theme.colors.text;
          return (
            <View
              key={session.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                minHeight: 40,
                borderTopWidth: 1,
                borderTopColor: Theme.colors.line,
              }}
            >
              <AppText mono size={12} color={Theme.colors.muted} style={{ width: 64 }}>
                {formatDay(session.start, timezone)}
              </AppText>
              <AppText size={15} weight="semibold" color={color} style={{ flex: 1 }}>
                {session.name}
              </AppText>
              <AppText mono weight="bold" size={15} color={color}>
                {session.hasTime ? formatClock(session.start, clock24, timezone) : "TBC"}
              </AppText>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={() =>
          navigation.navigate("RaceWeekend", { season: race.season, round: race.round })
        }
        accessibilityRole="button"
        style={({ pressed }) => ({
          minHeight: 44,
          borderRadius: Theme.radius.m,
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: pressed ? Theme.colors.line : Theme.colors.surfaceRaised,
        })}
      >
        <AppText size={14} weight="semibold">
          Weekend details
        </AppText>
        <Ionicons name="chevron-forward" size={16} color={Theme.colors.text} />
      </Pressable>
    </Card>
  );
};
