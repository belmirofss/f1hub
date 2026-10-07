import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { G, Line, Polyline, Text as SvgText } from "react-native-svg";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, EmptyState, TeamBar } from "../../components/Card";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLapPositions } from "../../hooks/useLapPositions";
import { usePitStops } from "../../hooks/usePitStops";
import { useOpenF1Drivers, useOpenF1RaceSession, useStints } from "../../hooks/useOpenF1";
import { getDriverCode, getDriverName, getTeamColor } from "../../helpers/teams";
import { lapTimeToMs } from "../../helpers/results";
import { Race, Result } from "../../types";

const CHART_HEIGHT = 240;
const LABEL_WIDTH = 26; // "P10" on the left
const END_WIDTH = 34; // driver code at the end of a line
const SHOWN = 10;

const COMPOUNDS: Record<string, { color: string; text: string; letter: string; name: string }> = {
  SOFT: { color: "#FF3B3B", text: "#FFFFFF", letter: "S", name: "Soft" },
  MEDIUM: { color: Theme.colors.sprint, text: Theme.colors.background, letter: "M", name: "Medium" },
  HARD: { color: Theme.colors.text, text: Theme.colors.background, letter: "H", name: "Hard" },
  INTERMEDIATE: { color: Theme.colors.gain, text: Theme.colors.background, letter: "I", name: "Inter" },
  WET: { color: "#4A90FF", text: "#FFFFFF", letter: "W", name: "Wet" },
};
const UNKNOWN_COMPOUND = { color: Theme.colors.lineDashed, text: Theme.colors.text, letter: "?", name: "Unknown" };

// Second driver of a team gets a dashed line so teammates can be told apart
const getDashes = (results: Result[]) => {
  const seen = new Set<string>();
  return new Map(
    results.map((r) => {
      const team = r.Constructor.constructorId;
      const dashed = seen.has(team);
      seen.add(team);
      return [r.Driver.driverId, dashed];
    })
  );
};

const LapChart = ({ race, results }: { race: Race; results: Result[] }) => {
  const [width, setWidth] = useState(0);
  const shown = results.slice(0, SHOWN);
  const [selected, setSelected] = useState(() => shown.slice(0, 3).map((r) => r.Driver.driverId));
  const laps = useLapPositions({ season: race.season, round: race.round });
  const dashes = getDashes(results);

  if (laps.isLoading) return <Card><Loading /></Card>;
  if (laps.isError) return <Card><Error onRetry={laps.refetch} /></Card>;
  if (!laps.data?.laps) return null;

  const total = laps.data.laps;
  const field = results.length;
  const plotWidth = width - LABEL_WIDTH - END_WIDTH;
  const x = (lap: number) => LABEL_WIDTH + (lap / total) * plotWidth;
  const y = (position: number) => 8 + ((position - 1) / (field - 1)) * (CHART_HEIGHT - 32);

  // Lap 0 is the grid; drivers stop where they retired
  const line = (result: Result) => {
    const positions = laps.data.positions[result.Driver.driverId] ?? [];
    const grid = Number(result.grid) || field;
    return [`${x(0)},${y(grid)}`, ...positions.map((p, i) => `${x(i + 1).toFixed(1)},${y(p).toFixed(1)}`)].join(" ");
  };

  const toggle = (driverId: string) =>
    setSelected((current) =>
      current.includes(driverId) ? current.filter((id) => id !== driverId) : [...current, driverId]
    );

  const ordered = [...shown].sort(
    (a, b) => Number(selected.includes(a.Driver.driverId)) - Number(selected.includes(b.Driver.driverId))
  );

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Label>LAP CHART · TOP {shown.length}</Label>
        <Label>{total} LAPS</Label>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {shown.map((result) => {
          const on = selected.includes(result.Driver.driverId);
          return (
            <Pressable
              key={result.Driver.driverId}
              onPress={() => toggle(result.Driver.driverId)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Highlight ${getDriverName(result.Driver)}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                height: 32,
                paddingHorizontal: 10,
                borderRadius: Theme.radius.m,
                borderWidth: 1,
                borderColor: on ? Theme.colors.lineDashed : Theme.colors.line,
                backgroundColor: on ? Theme.colors.surfaceRaised : "transparent",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getTeamColor(result.Constructor.constructorId),
                }}
              />
              <AppText mono weight="bold" size={12} color={on ? Theme.colors.text : Theme.colors.muted}>
                {getDriverCode(result.Driver)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <Svg width={width} height={CHART_HEIGHT} accessibilityLabel="Position of each driver lap by lap">
            {[1, 5, 10, 15, 20].filter((p) => p <= field).map((p) => (
              <G key={p}>
                <Line x1={LABEL_WIDTH} x2={width - END_WIDTH} y1={y(p)} y2={y(p)} stroke={Theme.colors.lineSoft} strokeWidth={1} />
                <SvgText x={0} y={y(p) + 3.5} fill={Theme.colors.subtle} fontSize={10} fontFamily={Theme.fonts.mono}>
                  P{p}
                </SvgText>
              </G>
            ))}
            {ordered.map((result) => {
              const on = selected.includes(result.Driver.driverId);
              return (
                <Polyline
                  key={result.Driver.driverId}
                  points={line(result)}
                  fill="none"
                  stroke={on ? getTeamColor(result.Constructor.constructorId) : Theme.colors.line}
                  strokeWidth={on ? 2.5 : 1.5}
                  strokeDasharray={dashes.get(result.Driver.driverId) ? "5 4" : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
            {shown
              .filter((r) => selected.includes(r.Driver.driverId))
              .map((result) => {
                const positions = laps.data.positions[result.Driver.driverId] ?? [];
                const last = positions.length;
                return (
                  <SvgText
                    key={result.Driver.driverId}
                    x={x(last) + 4}
                    y={y(positions[last - 1] ?? field) + 3.5}
                    fill={getTeamColor(result.Constructor.constructorId)}
                    fontSize={10}
                    fontFamily={Theme.fonts.monoBold}
                  >
                    {getDriverCode(result.Driver)}
                  </SvgText>
                );
              })}
            {[0, Math.round(total / 2), total].map((lap) => (
              <SvgText
                key={lap}
                x={x(lap)}
                y={CHART_HEIGHT - 4}
                fill={Theme.colors.subtle}
                fontSize={10}
                fontFamily={Theme.fonts.mono}
                textAnchor="middle"
              >
                {lap === 0 ? "GRID" : `L${lap}`}
              </SvgText>
            ))}
          </Svg>
        )}
      </View>
      <AppText size={12} color={Theme.colors.muted}>
        Tap drivers to compare. Dashed line = second driver of a team.
      </AppText>
    </Card>
  );
};

const TyreStrategy = ({ race, results }: { race: Race; results: Result[] }) => {
  const session = useOpenF1RaceSession({ season: race.season, date: race.date });
  const drivers = useOpenF1Drivers(session.data?.session_key);
  const stints = useStints(session.data?.session_key);

  if (!session.data || drivers.isError || stints.isError) return null;
  if (drivers.isLoading || stints.isLoading) return <Card><Loading /></Card>;
  if (!stints.data?.length) return null;

  const numberByCode = new Map((drivers.data ?? []).map((d) => [d.name_acronym, d.driver_number]));
  const totalLaps = Math.max(...stints.data.map((s) => s.lap_end ?? 0), 1);
  const used = new Set(stints.data.map((s) => s.compound));

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Label>TYRE STRATEGY</Label>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {Object.entries(COMPOUNDS)
            .filter(([key]) => used.has(key))
            .map(([key, c]) => (
              <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color }} />
                <AppText size={11} color={Theme.colors.muted}>
                  {c.name}
                </AppText>
              </View>
            ))}
        </View>
      </View>
      <View style={{ gap: 6 }}>
        {results.map((result, index) => {
          const number = numberByCode.get(getDriverCode(result.Driver));
          const own = stints.data
            .filter((s) => s.driver_number === number && s.lap_end >= s.lap_start)
            .sort((a, b) => a.stint_number - b.stint_number);
          if (!own.length) return null;
          const lastLap = own[own.length - 1].lap_end;
          return (
            <View
              key={result.Driver.driverId}
              accessible
              accessibilityLabel={`${getDriverName(result.Driver)}: ${own
                .map((s) => `${(COMPOUNDS[s.compound] ?? UNKNOWN_COMPOUND).name} for ${s.lap_end - s.lap_start + 1} laps`)
                .join(", ")}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <AppText mono size={11} color={Theme.colors.muted} style={{ width: 18, textAlign: "right" }}>
                {index + 1}
              </AppText>
              <AppText mono weight="bold" size={12} style={{ width: 32 }}>
                {getDriverCode(result.Driver)}
              </AppText>
              <View style={{ flex: 1, flexDirection: "row", gap: 2, height: 22 }}>
                {own.map((stint) => {
                  const c = COMPOUNDS[stint.compound] ?? UNKNOWN_COMPOUND;
                  const length = stint.lap_end - stint.lap_start + 1;
                  return (
                    <View
                      key={stint.stint_number}
                      style={{
                        flex: length,
                        borderRadius: 4,
                        backgroundColor: c.color,
                        justifyContent: "center",
                        paddingLeft: 5,
                        overflow: "hidden",
                      }}
                    >
                      <AppText mono weight="bold" size={10} color={c.text} numberOfLines={1}>
                        {length >= 6 ? `${c.letter} ${length}` : c.letter}
                      </AppText>
                    </View>
                  );
                })}
                {lastLap < totalLaps && <View style={{ flex: totalLaps - lastLap }} />}
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 58 }}>
        <AppText mono size={10} color={Theme.colors.subtle}>L1</AppText>
        <AppText mono size={10} color={Theme.colors.subtle}>L{Math.round(totalLaps / 2)}</AppText>
        <AppText mono size={10} color={Theme.colors.subtle}>L{totalLaps}</AppText>
      </View>
    </Card>
  );
};

const PitStops = ({ race, results }: { race: Race; results: Result[] }) => {
  const stops = usePitStops({ season: race.season, round: race.round });
  if (!stops.data?.length) return null;

  const byDriver = new Map(results.map((r) => [r.Driver.driverId, r]));
  const fastest = stops.data
    .map((stop) => ({ stop, ms: lapTimeToMs(stop.duration) ?? Infinity }))
    .sort((a, b) => a.ms - b.ms)
    .slice(0, 5);

  return (
    <Card style={{ gap: 0, paddingBottom: 4 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
        <Label>FASTEST PIT STOPS</Label>
        <Label>TIME IN PIT LANE</Label>
      </View>
      {fastest.map(({ stop }, index) => {
        const result = byDriver.get(stop.driverId);
        return (
          <View
            key={`${stop.driverId}-${stop.stop}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              minHeight: 44,
              borderTopWidth: 1,
              borderTopColor: Theme.colors.lineSoft,
            }}
          >
            <AppText mono weight="bold" size={12} style={{ width: 18 }}>
              {index + 1}
            </AppText>
            <TeamBar color={getTeamColor(result?.Constructor.constructorId)} height={24} />
            <AppText size={15} weight="bold" style={{ flex: 1 }} numberOfLines={1}>
              {result ? getDriverName(result.Driver) : stop.driverId}
            </AppText>
            <AppText mono size={11} color={Theme.colors.muted}>
              LAP {stop.lap}
            </AppText>
            <AppText
              mono
              weight="bold"
              size={14}
              color={index === 0 ? Theme.colors.purple : Theme.colors.text}
              style={{ width: 60, textAlign: "right" }}
            >
              {stop.duration}s
            </AppText>
          </View>
        );
      })}
    </Card>
  );
};

export const AnalysisTab = ({ race, results }: { race: Race; results: Result[] }) => {
  if (!results.length) return <EmptyState>No results yet.</EmptyState>;
  return (
    <>
      <LapChart race={race} results={results} />
      <TyreStrategy race={race} results={results} />
      <PitStops race={race} results={results} />
    </>
  );
};
