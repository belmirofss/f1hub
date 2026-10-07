import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, InlineLink, TeamBar } from "../../components/Card";
import { Stat, StatRows } from "../../components/StatRows";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLastRaceResults } from "../../hooks/useLastRaceResults";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";
import { getDriverName, getTeamColor } from "../../helpers/teams";
import { getFastestLap, getGridPosition, getTopGainer } from "../../helpers/results";
import { OPENF1_FIRST_SEASON } from "../../hooks/useOpenF1";

const Shortcut = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => ({
      flex: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: Theme.radius.m,
      backgroundColor: pressed ? Theme.colors.line : Theme.colors.surfaceRaised,
    })}
  >
    <Ionicons name={icon} size={16} color={Theme.colors.text} />
    <AppText size={13} weight="bold">
      {label}
    </AppText>
  </Pressable>
);

export const LastRaceCard = () => {
  const navigation = useNavigation();
  const { data, isLoading, isError, refetch } = useLastRaceResults();
  const race = data?.MRData.RaceTable.Races[0];
  const qualifying = useQualifyingResults({ season: race?.season, round: race?.round });

  // Pole comes from a second request; wait so its row doesn't pop in
  if (isLoading || qualifying.isLoading) return <Card><Loading /></Card>;
  if (isError) return <Card><Error onRetry={refetch} /></Card>;

  const results = race?.Results ?? [];
  const winner = results[0];
  if (!race || !winner) return null;

  const pole = qualifying.data?.MRData.RaceTable.Races[0]?.QualifyingResults?.[0];
  const hasOpenF1 = Number(race.season) >= OPENF1_FIRST_SEASON;
  const openTab = (tab: "analysis" | "radio") =>
    navigation.navigate("RaceWeekend", { season: race.season, round: race.round, tab });
  const fastest = getFastestLap(results);
  const gainer = getTopGainer(results);

  const stats: Stat[] = [];
  if (pole) {
    stats.push({
      label: "POLE",
      color: Theme.colors.muted,
      who: getDriverName(pole.Driver),
      value: pole.Q3 ?? pole.Q2 ?? pole.Q1,
    });
  }
  if (fastest) {
    stats.push({
      label: "FASTEST LAP",
      color: Theme.colors.purple,
      who: getDriverName(fastest.Driver),
      value: fastest.FastestLap?.Time.time,
    });
  }
  if (gainer && gainer.gained > 0) {
    stats.push({
      label: "TOP GAINER",
      color: Theme.colors.gain,
      who: getDriverName(gainer.result.Driver),
      value: `▲${gainer.gained} · P${getGridPosition(gainer.result, results.length)}→P${gainer.result.position}`,
    });
  }

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Label>LAST RACE · {race.Circuit.Location.locality.toUpperCase()}</Label>
        <InlineLink
          onPress={() =>
            navigation.navigate("RaceWeekend", { season: race.season, round: race.round })
          }
        >
          Results
        </InlineLink>
      </View>

      <Pressable
        onPress={() => navigation.navigate("Driver", { driverId: winner.Driver.driverId })}
        accessibilityRole="button"
        style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, opacity: pressed ? 0.7 : 1 })}
      >
        <TeamBar color={getTeamColor(winner.Constructor.constructorId)} height={44} />
        <View style={{ flex: 1 }}>
          <AppText size={12} color={Theme.colors.muted}>
            {race.raceName} winner
          </AppText>
          <AppText size={20} weight="bold">
            {getDriverName(winner.Driver)}
          </AppText>
        </View>
        <AppText mono size={13}>
          {winner.Time?.time ?? ""}
        </AppText>
      </Pressable>

      {stats.length > 0 && (
        <View style={{ borderTopWidth: 1, borderTopColor: Theme.colors.line, paddingTop: 2 }}>
          <StatRows stats={stats} />
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Shortcut icon="analytics-outline" label="Lap chart" onPress={() => openTab("analysis")} />
        {hasOpenF1 && <Shortcut icon="disc-outline" label="Tyres" onPress={() => openTab("analysis")} />}
        {hasOpenF1 && <Shortcut icon="mic-outline" label="Radio" onPress={() => openTab("radio")} />}
      </View>
    </Card>
  );
};
