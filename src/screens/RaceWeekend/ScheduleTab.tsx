import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import moment from "moment-timezone";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, LinkCard } from "../../components/Card";
import { WeekendForecast } from "../../components/Weather";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_RACE_SCHEDULE_ID } from "../../constants";
import { useSettings } from "../../settings/SettingsContext";
import { useNow } from "../../hooks/useNow";
import { useWeather } from "../../hooks/useWeather";
import { Session, getSessions } from "../../helpers/sessions";
import { getCircuitLayout, getCircuitTimezone } from "../../helpers/circuits";
import {
  formatClock,
  formatDay,
  getTimezone,
  getUtcOffsetLabel,
} from "../../helpers/time";
import { Race } from "../../types";

// Fri–Sun bar with a marker per session, placed by its real start time
const WeekendTimeline = ({ sessions, now }: { sessions: Session[]; now: number }) => {
  const { accent } = useSettings();
  const timezone = getTimezone();
  const first = sessions[0].start.clone().tz(timezone).startOf("day");
  const last = sessions[sessions.length - 1].start.clone().tz(timezone).endOf("day");
  const span = last.valueOf() - first.valueOf();
  const days = Math.round(span / 86400000);

  if (days < 2 || days > 4) return null;

  const position = (value: number) => `${((value - first.valueOf()) / span) * 100}%` as const;
  const nowInside = now > first.valueOf() && now < last.valueOf();

  return (
    <Card style={{ paddingBottom: 10 }}>
      <Label>WEEKEND AT A GLANCE</Label>
      <View style={{ height: 76, marginTop: 4 }}>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 30,
            height: 4,
            borderRadius: 2,
            backgroundColor: Theme.colors.line,
          }}
        />
        {Array.from({ length: days - 1 }, (_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: `${((i + 1) / days) * 100}%`,
              top: 20,
              width: 1,
              height: 24,
              backgroundColor: Theme.colors.lineDashed,
            }}
          />
        ))}
        {nowInside && (
          <View
            style={{
              position: "absolute",
              left: position(now),
              top: 18,
              width: 2,
              height: 28,
              backgroundColor: Theme.colors.text,
            }}
          />
        )}
        {sessions.map((session, index) => {
          const isRace = session.key === "race";
          const done = session.start.valueOf() <= now;
          const up = index % 2 === 0;
          return (
            <View
              key={session.key}
              style={{
                position: "absolute",
                left: position(session.start.valueOf()),
                top: 0,
                width: 48,
                marginLeft: -24,
                alignItems: "center",
              }}
            >
              <AppText
                mono
                weight="bold"
                size={9}
                color={isRace ? accent : Theme.colors.text}
                style={{ height: 14, opacity: up ? 1 : 0 }}
              >
                {session.short}
              </AppText>
              <View
                style={{
                  marginTop: 9,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: isRace || done ? accent : Theme.colors.background,
                  borderWidth: isRace || done ? 0 : 3,
                  borderColor: Theme.colors.text,
                }}
              />
              <AppText
                mono
                weight="bold"
                size={9}
                color={Theme.colors.text}
                style={{ marginTop: 6, opacity: up ? 0 : 1 }}
              >
                {session.short}
              </AppText>
            </View>
          );
        })}
        <View
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row" }}
        >
          {Array.from({ length: days }, (_, i) => (
            <AppText
              key={i}
              mono
              size={10}
              color={Theme.colors.muted}
              style={{ flex: 1, textAlign: "center" }}
            >
              {first.clone().add(i, "day").format("ddd").toUpperCase()}
            </AppText>
          ))}
        </View>
      </View>
    </Card>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.lineSoft,
    }}
  >
    <AppText color={Theme.colors.muted}>{label}</AppText>
    <AppText weight="semibold" style={{ flexShrink: 1, textAlign: "right" }}>
      {value}
    </AppText>
  </View>
);

export const ScheduleTab = ({ race }: { race: Race }) => {
  const { accent, clock24 } = useSettings();
  const navigation = useNavigation();
  const now = useNow(60000);
  const weather = useWeather({ race, now });
  const sessions = getSessions(race);
  const trackZone = getCircuitTimezone(race.Circuit.circuitId);
  const layout = getCircuitLayout(race.Circuit.circuitId);

  return (
    <>
      {sessions.every((s) => s.hasTime) && <WeekendTimeline sessions={sessions} now={now} />}

      {weather.data && <WeekendForecast race={race} forecast={weather.data} />}

      <View>
        <View style={{ flexDirection: "row", paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: Theme.colors.line }}>
          <Label style={{ flex: 1 }}>SESSION</Label>
          <Label color={Theme.colors.text} style={{ width: 72, textAlign: "right" }}>
            YOU · {getUtcOffsetLabel()}
          </Label>
          {trackZone && (
            <Label style={{ width: 64, textAlign: "right" }}>TRACK</Label>
          )}
        </View>
        {sessions.map((session) => {
          const isRace = session.key === "race";
          return (
            <View
              key={session.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                minHeight: 54,
                borderBottomWidth: 1,
                borderBottomColor: Theme.colors.lineSoft,
              }}
            >
              <View style={{ flex: 1 }}>
                <AppText size={15} weight="bold" color={isRace ? accent : Theme.colors.text}>
                  {session.name}
                </AppText>
                <AppText mono size={11} color={Theme.colors.muted}>
                  {formatDay(session.start)}
                </AppText>
              </View>
              <AppText mono weight="bold" size={16} style={{ width: 72, textAlign: "right" }}>
                {session.hasTime ? formatClock(session.start, clock24) : "TBC"}
              </AppText>
              {trackZone && (
                <AppText
                  mono
                  size={13}
                  color={Theme.colors.muted}
                  style={{ width: 64, textAlign: "right" }}
                >
                  {session.hasTime ? formatClock(session.start, clock24, trackZone) : "—"}
                </AppText>
              )}
            </View>
          );
        })}
      </View>

      <View>
        <InfoRow label="Circuit" value={race.Circuit.circuitName} />
        <InfoRow
          label="Location"
          value={`${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`}
        />
        {trackZone && (
          <InfoRow
            label="Track time"
            value={`GMT${moment().tz(trackZone).format("Z").replace(":00", "")}`}
          />
        )}
      </View>

      <LinkCard
        onPress={() => navigation.navigate("Circuit", { circuitId: race.Circuit.circuitId })}
        accessibilityLabel={`${race.Circuit.circuitName} guide`}
      >
        <AppText size={15} weight="bold">
          {race.Circuit.circuitName}
        </AppText>
        <AppText mono size={10} color={Theme.colors.muted}>
          {layout ? `${layout.length.toFixed(3)} KM · ${layout.corners} CORNERS · ` : ""}TRACK MAP AND HISTORY
        </AppText>
      </LinkCard>

      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(race.url)}
        accessibilityRole="link"
        style={({ pressed }) => ({
          minHeight: 44,
          borderRadius: Theme.radius.m,
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: pressed ? Theme.colors.line : Theme.colors.surface,
        })}
      >
        <AppText size={14} weight="semibold">
          Race history on Wikipedia
        </AppText>
        <Ionicons name="open-outline" size={16} color={Theme.colors.text} />
      </Pressable>

      <AdBanner adUnitId={AD_BANNER_RACE_SCHEDULE_ID} />
    </>
  );
};
