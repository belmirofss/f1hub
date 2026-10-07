import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { Theme } from "../theme";
import { AppText, Label } from "./AppText";
import { Card } from "./Card";
import { useSettings } from "../settings/SettingsContext";
import { getSessions } from "../helpers/sessions";
import { getCircuitTimezone } from "../helpers/circuits";
import { formatClock, formatDay, getTimezone } from "../helpers/time";
import {
  Forecast,
  HourForecast,
  formatRainChance,
  getCondition,
  getHourAt,
  getHoursBetween,
  getWorstCode,
} from "../helpers/weather";
import { Race } from "../types";

const HOUR = 3600000;
const RAIN = "#6FB7FF";

const rainColor = (chance: number) =>
  chance >= 50 ? RAIN : chance >= 30 ? Theme.colors.text : Theme.colors.muted;

const round = (value: number) => Math.round(value);

// Every forecast hour from the first session's day to two hours after the race
const weekendHours = (race: Race, forecast: Forecast) => {
  const sessions = getSessions(race);
  const start = sessions[0].start.clone().startOf("day").valueOf();
  const end = sessions[sessions.length - 1].start.valueOf() + 2 * HOUR;
  return getHoursBetween(forecast, start, end);
};

// "Dry all weekend · 25–29°C · wind 14 km/h" for the Home next-race card
export const WeatherSummary = ({ race, forecast }: { race: Race; forecast: Forecast }) => {
  const hours = weekendHours(race, forecast);
  if (!hours.length) return null;

  const rain = Math.max(...hours.map((h) => h.rainChance));
  const temps = hours.map((h) => h.temperature);
  const wind = Math.max(...hours.map((h) => h.wind));
  const condition = getCondition(getWorstCode(hours));
  const headline = rain < 20 ? "Dry all weekend" : rain >= 50 ? "Rain likely" : "Chance of rain";

  return (
    <View
      accessible
      accessibilityLabel={`${headline}, ${round(Math.min(...temps))} to ${round(Math.max(...temps))} degrees, up to ${round(rain)}% chance of rain`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: Theme.radius.m,
        backgroundColor: Theme.colors.surfaceRaised,
      }}
    >
      <Ionicons name={condition.icon} size={22} color={rain >= 50 ? RAIN : Theme.colors.sprint} />
      <View style={{ flex: 1 }}>
        <AppText size={14} weight="bold">
          {headline}
        </AppText>
        <AppText mono size={10} color={Theme.colors.muted}>
          {round(Math.min(...temps))}–{round(Math.max(...temps))}°C · WIND {round(wind)} KM/H · OPEN-METEO
        </AppText>
      </View>
      <AppText mono weight="bold" size={13} color={rainColor(rain)}>
        {formatRainChance(rain)}
      </AppText>
    </View>
  );
};

// Temperature at a session's start, for session rows
export const SessionTemperature = ({ forecast, start }: { forecast?: Forecast; start: number }) => {
  const hour = forecast && getHourAt(forecast, start);
  if (!hour) return null;
  return (
    <AppText mono size={11} color={Theme.colors.muted} style={{ width: 40 }}>
      {round(hour.temperature)}°
    </AppText>
  );
};

const SessionDetail = ({ forecast, hour, start }: { forecast: Forecast; hour: HourForecast; start: number }) => {
  const around = getHoursBetween(forecast, start - HOUR, start + 3 * HOUR);
  return (
    <View
      style={{
        gap: 12,
        paddingTop: 4,
        paddingBottom: 14,
        paddingLeft: 25,
        paddingRight: 12,
        backgroundColor: Theme.colors.surfaceRaised,
      }}
    >
      <AppText size={14} color="#D4D4D8">
        {getCondition(hour.code).label}
      </AppText>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { value: round(hour.wind), label: "WIND KM/H" },
          { value: `${round(hour.humidity)}%`, label: "HUMIDITY" },
          { value: hour.rain.toFixed(1), label: "RAIN MM" },
        ].map((stat) => (
          <View key={stat.label} style={{ flex: 1 }}>
            <AppText mono weight="bold" size={16}>
              {stat.value}
            </AppText>
            <Label style={{ fontSize: 10 }}>{stat.label}</Label>
          </View>
        ))}
      </View>
      {around.length > 1 && (
        <View style={{ gap: 6 }}>
          <Label style={{ fontSize: 10 }}>RAIN CHANCE, HOUR BY HOUR</Label>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 48 }}>
            {around.map((h) => (
              <View key={h.time} style={{ flex: 1, justifyContent: "flex-end", height: "100%" }}>
                <View
                  style={{
                    height: Math.max(3, h.rainChance * 0.46),
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    backgroundColor: h.rainChance >= 50 ? RAIN : Theme.colors.lineDashed,
                  }}
                />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {around.map((h) => (
              <AppText key={h.time} mono size={10} color={Theme.colors.muted} style={{ flex: 1, textAlign: "center" }}>
                {formatRainChance(h.rainChance)}
              </AppText>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Day-by-day outlook plus a forecast per session (tap one for detail)
export const WeekendForecast = ({ race, forecast }: { race: Race; forecast: Forecast }) => {
  const { accent, clock24 } = useSettings();
  const [open, setOpen] = useState<string>("race");
  const timezone = getCircuitTimezone(race.Circuit.circuitId) ?? getTimezone();
  const sessions = getSessions(race).filter((s) => s.hasTime);

  const days = [...new Set(sessions.map((s) => s.start.clone().tz(timezone).startOf("day").valueOf()))].flatMap(
    (day) => {
      const hours = getHoursBetween(forecast, day, day + 24 * HOUR);
      if (!hours.length) return [];
      return [
        {
          day,
          label: moment.tz(day, timezone).format("ddd").toUpperCase(),
          high: Math.max(...hours.map((h) => h.temperature)),
          low: Math.min(...hours.map((h) => h.temperature)),
          rain: Math.max(...hours.map((h) => h.rainChance)),
          condition: getCondition(getWorstCode(hours)),
        },
      ];
    }
  );
  if (!days.length) return null;

  return (
    <>
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Label>WEEKEND FORECAST</Label>
          <Label color={Theme.colors.subtle}>OPEN-METEO</Label>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {days.map((d) => (
            <View
              key={d.day}
              accessible
              accessibilityLabel={`${d.label}: ${d.condition.label}, high ${round(d.high)}, low ${round(d.low)}, ${round(d.rain)}% chance of rain`}
              style={{
                flex: 1,
                alignItems: "center",
                gap: 6,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: Theme.colors.surfaceRaised,
              }}
            >
              <Label>{d.label}</Label>
              <Ionicons name={d.condition.icon} size={26} color={Theme.colors.text} />
              <AppText mono weight="bold" size={15}>
                {round(d.high)}°{" "}
                <AppText mono size={15} color={Theme.colors.muted}>
                  {round(d.low)}°
                </AppText>
              </AppText>
              <AppText mono size={11} color={rainColor(d.rain)}>
                {formatRainChance(d.rain)} RAIN
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <View
        style={{
          borderRadius: Theme.radius.l,
          borderWidth: 1,
          borderColor: Theme.colors.line,
          backgroundColor: Theme.colors.surface,
          overflow: "hidden",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12, paddingBottom: 8 }}>
          <Label>FORECAST BY SESSION</Label>
          <Label>TAP FOR DETAIL</Label>
        </View>
        {sessions.map((session) => {
          const hour = getHourAt(forecast, session.start.valueOf());
          const isOpen = open === session.key && !!hour;
          const bar =
            session.key === "race" ? accent : session.key === "sprint" ? Theme.colors.sprint : Theme.colors.lineDashed;
          return (
            <View key={session.key}>
              <Pressable
                onPress={() => setOpen(isOpen ? "" : session.key)}
                disabled={!hour}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 56,
                  paddingHorizontal: 12,
                  borderTopWidth: 1,
                  borderTopColor: Theme.colors.lineSoft,
                  backgroundColor: isOpen ? Theme.colors.surfaceRaised : "transparent",
                }}
              >
                <View style={{ width: 3, height: 30, borderRadius: 2, backgroundColor: bar }} />
                <View style={{ flex: 1 }}>
                  <AppText size={15} weight="bold">
                    {session.name}
                  </AppText>
                  <AppText mono size={10} color={Theme.colors.muted}>
                    {formatDay(session.start)} {formatClock(session.start, clock24)}
                  </AppText>
                </View>
                {hour ? (
                  <>
                    <Ionicons name={getCondition(hour.code).icon} size={20} color={Theme.colors.text} />
                    <AppText mono weight="bold" size={14} style={{ width: 34, textAlign: "right" }}>
                      {round(hour.temperature)}°
                    </AppText>
                    <AppText mono weight="bold" size={12} color={rainColor(hour.rainChance)} style={{ width: 44, textAlign: "right" }}>
                      {formatRainChance(hour.rainChance)}
                    </AppText>
                  </>
                ) : (
                  <AppText mono size={11} color={Theme.colors.subtle}>
                    NOT YET
                  </AppText>
                )}
              </Pressable>
              {isOpen && hour && <SessionDetail forecast={forecast} hour={hour} start={session.start.valueOf()} />}
            </View>
          );
        })}
      </View>
    </>
  );
};
