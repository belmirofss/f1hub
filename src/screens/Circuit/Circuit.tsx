import { useState } from "react";
import { Pressable, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, InlineLink, TeamBar } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { TrackMap } from "../../components/TrackMap";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { useCircuitHistory } from "../../hooks/useCircuitHistory";
import { OPENF1_FIRST_SEASON, useOpenF1RaceSession, useTrackOutline } from "../../hooks/useOpenF1";
import { getCircuitLayout } from "../../helpers/circuits";
import { getDriverName, getTeamColor } from "../../helpers/teams";
import { lapTimeToMs } from "../../helpers/results";
import { RaceResults } from "../../types";

type ParamList = {
  Circuit: { circuitId: string };
};

const Fact = ({ label, value }: { label: string; value: string | number }) => (
  <View
    accessible
    accessibilityLabel={`${label.toLowerCase()}: ${value}`}
    style={{
      flexBasis: "30%",
      flexGrow: 1,
      gap: 2,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Theme.colors.line,
      backgroundColor: Theme.colors.surface,
    }}
  >
    <AppText mono weight="bold" size={17}>
      {value}
    </AppText>
    <Label style={{ fontSize: 10 }}>{label}</Label>
  </View>
);

// Outline from the latest race here that OpenF1 has data for
const MapCard = ({ races }: { races: RaceResults[] }) => {
  const [width, setWidth] = useState(0);
  const latest = [...races].reverse().find((r) => Number(r.season) >= OPENF1_FIRST_SEASON);
  const session = useOpenF1RaceSession({ season: latest?.season, date: latest?.date });
  const outline = useTrackOutline(session.data?.session_key);

  if (!latest || session.isError || outline.isError) return null;
  if (!session.isLoading && !session.data) return null;
  if (outline.data && outline.data.length < 20) return null;

  return (
    <Card style={{ padding: 12 }}>
      <Label style={{ paddingLeft: 4 }}>TRACK MAP · {latest.season} LAYOUT</Label>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ minHeight: 230 }}>
        {outline.data && width > 0 ? (
          <TrackMap points={outline.data} width={width} height={230} />
        ) : (
          <Loading />
        )}
      </View>
    </Card>
  );
};

export const Circuit = () => {
  const { params } = useRoute<RouteProp<ParamList, "Circuit">>();
  const { circuitId } = params;
  const navigation = useNavigation();
  const { accent } = useSettings();
  const history = useCircuitHistory({ circuitId });

  if (history.isLoading) return <Screen showBack><Loading /></Screen>;
  const races = history.data?.races ?? [];
  if (history.isError || !races.length) {
    return <Screen showBack><Error onRetry={history.refetch} /></Screen>;
  }

  const circuit = races[races.length - 1].Circuit;
  const layout = getCircuitLayout(circuitId);
  const laps = Number(races[races.length - 1].Results?.[0]?.laps ?? 0);

  const fastest = (history.data?.fastestLaps ?? [])
    .flatMap((race) => {
      const result = race.Results?.[0];
      const ms = lapTimeToMs(result?.FastestLap?.Time.time);
      return result && ms ? [{ race, result, ms }] : [];
    })
    .sort((a, b) => a.ms - b.ms)[0];

  const winsByDriver = new Map<string, { name: string; wins: number; teamId: string }>();
  races.forEach((race) => {
    const winner = race.Results?.[0];
    if (!winner) return;
    const entry = winsByDriver.get(winner.Driver.driverId) ?? {
      name: getDriverName(winner.Driver),
      wins: 0,
      teamId: winner.Constructor.constructorId,
    };
    entry.wins++;
    winsByDriver.set(winner.Driver.driverId, entry);
  });
  const mostWins = [...winsByDriver.values()].sort((a, b) => b.wins - a.wins).slice(0, 3);
  const recent = races.slice(-6).reverse();

  return (
    <Screen
      showBack
      meta={`CIRCUIT · ${circuit.Location.country.toUpperCase()}`}
      title={circuit.circuitName}
    >
      <MapCard races={races} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {layout && <Fact label="KM / LAP" value={layout.length.toFixed(3)} />}
        {laps > 0 && <Fact label="LAPS" value={laps} />}
        {layout && laps > 0 && <Fact label="KM RACE" value={(layout.length * laps).toFixed(1)} />}
        {layout && <Fact label="CORNERS" value={layout.corners} />}
        <Fact label="FIRST GP" value={races[0].season} />
        <Fact label="RACES HELD" value={races.length} />
      </View>

      {fastest && (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="stopwatch-outline" size={22} color={Theme.colors.purple} />
          <View style={{ flex: 1 }}>
            <Label>FASTEST RACE LAP</Label>
            <AppText size={15} weight="bold">
              {getDriverName(fastest.result.Driver)} · {fastest.race.season}
            </AppText>
          </View>
          <AppText mono weight="bold" size={17} color={Theme.colors.purple}>
            {fastest.result.FastestLap?.Time.time}
          </AppText>
        </Card>
      )}

      <Card style={{ gap: 0, paddingBottom: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
          <Label>RECENT WINNERS</Label>
          <Label>TEAM</Label>
        </View>
        {recent.map((race) => {
          const winner = race.Results?.[0];
          if (!winner) return null;
          return (
            <Pressable
              key={race.season}
              onPress={() => navigation.navigate("RaceWeekend", { season: race.season, round: race.round })}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                borderTopWidth: 1,
                borderTopColor: Theme.colors.lineSoft,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <AppText mono weight="bold" size={13} color={Theme.colors.muted} style={{ width: 40 }}>
                {race.season}
              </AppText>
              <TeamBar color={getTeamColor(winner.Constructor.constructorId)} height={24} />
              <AppText size={15} weight="bold" style={{ flex: 1 }} numberOfLines={1}>
                {getDriverName(winner.Driver)}
              </AppText>
              <AppText size={13} color={Theme.colors.muted}>
                {winner.Constructor.name}
              </AppText>
            </Pressable>
          );
        })}
      </Card>

      {mostWins[0] && mostWins[0].wins > 1 && (
        <Card>
          <Label>MOST WINS HERE</Label>
          {mostWins.map((driver, index) => (
            <View key={driver.name} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <AppText size={14} weight="bold" style={{ width: 130 }} numberOfLines={1}>
                {driver.name}
              </AppText>
              <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: Theme.colors.surfaceRaised }}>
                <View
                  style={{
                    width: `${(driver.wins / mostWins[0].wins) * 100}%`,
                    height: "100%",
                    borderRadius: 4,
                    backgroundColor: index === 0 ? accent : Theme.colors.text,
                  }}
                />
              </View>
              <AppText mono weight="bold" size={14} style={{ width: 20, textAlign: "right" }}>
                {driver.wins}
              </AppText>
            </View>
          ))}
        </Card>
      )}

      <InlineLink onPress={() => WebBrowser.openBrowserAsync(circuit.url)}>Circuit on Wikipedia</InlineLink>
    </Screen>
  );
};
