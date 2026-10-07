import { useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, InlineLink, TeamBar } from "../../components/Card";
import { useSettings } from "../../settings/SettingsContext";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";
import {
  Contender,
  NO_POINTS_POSITION,
  getContenders,
  getPointsLeft,
  getRacePoints,
} from "../../helpers/championship";
import { getDriverName, getTeamColor } from "../../helpers/teams";

// More than this and it's not a "fight" worth a card yet (early season)
const MAX_CONTENDERS = 5;

const contenderColor = (contender: Contender) =>
  getTeamColor(contender.standing.Constructors.at(-1)?.constructorId);

// Points now (solid) and what's still reachable (hatched), against the leader's mark
const ReachBar = ({
  contender,
  scaleMax,
  leaderPoints,
}: {
  contender: Contender;
  scaleMax: number;
  leaderPoints: number;
}) => {
  const now = (contender.points / scaleMax) * 100;
  return (
    <View style={{ flex: 1, height: 10, borderRadius: 3, backgroundColor: Theme.colors.surfaceRaised }}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          borderRadius: 3,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: Theme.colors.lineDashed,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${now}%`,
          borderRadius: 3,
          backgroundColor: contenderColor(contender),
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -3,
          bottom: -3,
          width: 2,
          left: `${(leaderPoints / scaleMax) * 100}%`,
          backgroundColor: Theme.colors.text,
        }}
      />
    </View>
  );
};

const StepButton = ({
  icon,
  label,
  onPress,
}: {
  icon: "chevron-up" | "chevron-down";
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => ({
      width: 44,
      height: 44,
      borderRadius: Theme.radius.m,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: Theme.colors.line,
      backgroundColor: pressed ? Theme.colors.line : Theme.colors.surfaceRaised,
    })}
  >
    <Ionicons name={icon} size={18} color={Theme.colors.text} />
  </Pressable>
);

// Final-round simulator: pick where each contender finishes, see who's champion
const WhatIf = ({ contenders, raceName }: { contenders: Contender[]; raceName?: string }) => {
  const { accent, onAccent } = useSettings();
  const initial = Object.fromEntries(contenders.map((c, i) => [c.code, i + 1]));
  const [positions, setPositions] = useState<Record<string, number>>(initial);

  const move = (code: string, delta: number) =>
    setPositions((current) => ({
      ...current,
      [code]: Math.min(NO_POINTS_POSITION, Math.max(1, current[code] + delta)),
    }));

  const totals = contenders.map((c) => ({ ...c, total: c.points + getRacePoints(positions[c.code]) }));
  const placed = contenders.map((c) => positions[c.code]).filter((p) => p < NO_POINTS_POSITION);
  const clash = new Set(placed).size !== placed.length;
  const best = Math.max(...totals.map((t) => t.total));
  const top = totals.filter((t) => t.total === best);
  const champion = !clash && top.length === 1 ? top[0] : undefined;
  const runnerUp = champion
    ? Math.max(...totals.filter((t) => t !== champion).map((t) => t.total))
    : 0;

  const verdict = clash
    ? "Two drivers can't share a position"
    : champion
    ? `${getDriverName(champion.standing.Driver)} is champion by ${+(best - runnerUp).toFixed(1)}`
    : `Tied on ${best}: decided on countback`;

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Label>WHAT IF{raceName ? ` · ${raceName.replace(" Grand Prix", "").toUpperCase()}` : ""}</Label>
        <Pressable onPress={() => setPositions(initial)} accessibilityRole="button" hitSlop={8} style={{ minHeight: 32, justifyContent: "center" }}>
          <AppText size={13} weight="bold" color={accent}>
            Reset
          </AppText>
        </Pressable>
      </View>
      {totals.map((t) => {
        const position = positions[t.code];
        const name = getDriverName(t.standing.Driver);
        return (
          <View key={t.code} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TeamBar color={contenderColor(t)} height={28} />
            <AppText mono weight="bold" size={13} style={{ width: 34 }}>
              {t.code}
            </AppText>
            <StepButton icon="chevron-up" label={`Move ${name} up one place`} onPress={() => move(t.code, -1)} />
            <AppText mono weight="bold" size={15} style={{ width: 46, textAlign: "center" }}>
              {position < NO_POINTS_POSITION ? `P${position}` : "P11+"}
            </AppText>
            <StepButton icon="chevron-down" label={`Move ${name} down one place`} onPress={() => move(t.code, 1)} />
            <AppText
              mono
              weight="bold"
              size={15}
              color={t === champion ? accent : Theme.colors.text}
              style={{ flex: 1, textAlign: "right" }}
            >
              {+t.total.toFixed(1)}
            </AppText>
          </View>
        );
      })}
      <AppText size={11} color={Theme.colors.subtle}>
        Arrows move a driver up or down the order. P11+ scores nothing.
      </AppText>
      <View
        accessibilityLiveRegion="polite"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 10,
          backgroundColor: champion ? accent : Theme.colors.surfaceRaised,
        }}
      >
        <Ionicons name="trophy-outline" size={20} color={champion ? onAccent : clash ? Theme.colors.loss : Theme.colors.text} />
        <AppText size={15} weight="bold" color={champion ? onAccent : clash ? Theme.colors.loss : Theme.colors.text} style={{ flex: 1 }}>
          {verdict}
        </AppText>
      </View>
    </View>
  );
};

// "Who can still win the title?" Hidden until only a handful of drivers can.
// Compact on Home; the Standings version adds what each needs and the simulator.
export const TitleFightCard = ({ compact }: { compact?: boolean }) => {
  const navigation = useNavigation();
  const { accent } = useSettings();
  const standings = useSeasonDriverStandings({ season: "current" });
  const schedule = useSeasonRaceSchedule({ season: "current" });

  const list = standings.data?.MRData.StandingsTable.StandingsLists[0];
  const races = schedule.data?.MRData.RaceTable.Races ?? [];
  if (!list || !races.length) return null;

  const left = getPointsLeft(races, Number(list.round));
  const contenders = getContenders(list.DriverStandings, left);
  if (contenders.length < 2 || contenders.length > MAX_CONTENDERS) return null;

  const leaderPoints = contenders[0].points;
  const scaleMax = leaderPoints + left.points;
  const finale = left.races === 1 && left.sprints === 0;
  const roundsLabel = `${left.races} ${left.races === 1 ? "ROUND" : "ROUNDS"} LEFT · ${left.points} PTS`;

  const header = (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Label color={accent}>TITLE FIGHT{compact ? ` · ${left.points} PTS LEFT` : ""}</Label>
      {compact ? (
        <InlineLink onPress={() => navigation.navigate("Standings")}>
          {finale ? "What if" : "Standings"}
        </InlineLink>
      ) : (
        <Label>{roundsLabel}</Label>
      )}
    </View>
  );

  if (compact) {
    return (
      <Card style={{ borderColor: Theme.colors.lineDashed }}>
        {header}
        <View style={{ gap: 8 }}>
          {contenders.map((c, index) => (
            <View
              key={c.code}
              accessible
              accessibilityLabel={`${c.code}, ${c.points} points${index ? `, ${c.gap} behind` : ", leader"}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TeamBar color={contenderColor(c)} height={16} />
              <AppText mono weight="bold" size={12} style={{ width: 34 }}>
                {c.code}
              </AppText>
              <ReachBar contender={c} scaleMax={scaleMax} leaderPoints={leaderPoints} />
              <AppText mono size={11} color={Theme.colors.muted} style={{ width: 34, textAlign: "right" }}>
                {index ? `-${+c.gap.toFixed(1)}` : "LDR"}
              </AppText>
              <AppText mono weight="bold" size={13} style={{ width: 34, textAlign: "right" }}>
                {+c.points.toFixed(1)}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    );
  }

  const nextRace = races.find((r) => Number(r.round) > Number(list.round));

  return (
    <Card style={{ borderColor: Theme.colors.lineDashed, gap: 14 }}>
      {header}
      <AppText size={20} weight="bold" style={{ lineHeight: 24 }}>
        {contenders.length === 2 ? "Two" : contenders.length === 3 ? "Three" : contenders.length === 4 ? "Four" : "Five"}{" "}
        drivers can still be champion
      </AppText>
      {contenders.map((c, index) => (
        <View key={c.code} style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TeamBar color={contenderColor(c)} height={14} />
            <AppText size={15} weight="bold" style={{ flex: 1 }} numberOfLines={1}>
              {getDriverName(c.standing.Driver)}
            </AppText>
            <AppText mono size={11} color={Theme.colors.muted}>
              {index ? `-${+c.gap.toFixed(1)}` : "LEADER"}
            </AppText>
            <AppText mono weight="bold" size={15} style={{ width: 40, textAlign: "right" }}>
              {+c.points.toFixed(1)}
            </AppText>
          </View>
          <ReachBar contender={c} scaleMax={scaleMax} leaderPoints={leaderPoints} />
          <AppText size={13} color="#C9C9D0">
            {c.needs}
          </AppText>
        </View>
      ))}
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: Theme.colors.muted }} />
          <AppText size={11} color={Theme.colors.muted}>Points now</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 8, borderRadius: 2, borderWidth: 1, borderStyle: "dashed", borderColor: Theme.colors.lineDashed }} />
          <AppText size={11} color={Theme.colors.muted}>Still possible</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 2, height: 10, backgroundColor: Theme.colors.text }} />
          <AppText size={11} color={Theme.colors.muted}>Leader now</AppText>
        </View>
      </View>
      {finale && (
        <>
          <View style={{ height: 1, backgroundColor: Theme.colors.lineSoft }} />
          <WhatIf
            key={contenders.map((c) => c.code).join()}
            contenders={contenders}
            raceName={nextRace?.raceName}
          />
        </>
      )}
    </Card>
  );
};
