import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, EmptyState, TeamBar } from "../../components/Card";
import { Stat, StatRows } from "../../components/StatRows";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_RACE_RESULT_1_ID } from "../../constants";
import { getDriverCode, getDriverName, getTeamColor } from "../../helpers/teams";
import {
  getFastestLap,
  getGapToLeader,
  getPlacesGained,
  getStatusLabel,
  getTopGainer,
  isClassified,
} from "../../helpers/results";
import { QualifyingResult, Result } from "../../types";

const COLUMNS = { pos: 30, delta: 30, time: 84, pts: 28 };

const Delta = ({ gained, classified }: { gained: number; classified: boolean }) => {
  if (!classified) return <View style={{ width: COLUMNS.delta }} />;
  const color = gained > 0 ? Theme.colors.gain : gained < 0 ? Theme.colors.loss : Theme.colors.muted;
  const text = gained > 0 ? `▲${gained}` : gained < 0 ? `▼${-gained}` : "–";
  return (
    <AppText
      mono
      size={11}
      color={color}
      style={{ width: COLUMNS.delta }}
      accessibilityLabel={
        gained > 0 ? `gained ${gained}` : gained < 0 ? `lost ${-gained}` : "no change"
      }
    >
      {text}
    </AppText>
  );
};

type Props = {
  results: Result[];
  pole?: QualifyingResult;
};

export const ResultsTab = ({ results, pole }: Props) => {
  const navigation = useNavigation();
  if (!results.length) return <EmptyState>No results yet.</EmptyState>;

  const size = results.length;
  const leader = results[0];
  const fastest = getFastestLap(results);
  const gainer = getTopGainer(results);
  const retired = results.filter((r) => !isClassified(r));

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
      value: `${fastest.FastestLap?.Time.time} · L${fastest.FastestLap?.lap}`,
    });
  }
  if (gainer && gainer.gained > 0) {
    stats.push({
      label: "TOP GAINER",
      color: Theme.colors.gain,
      who: getDriverName(gainer.result.Driver),
      value: `▲${gainer.gained}`,
    });
  }
  stats.push({
    label: "RETIREMENTS",
    color: Theme.colors.loss,
    who: retired.length ? retired.map((r) => getDriverCode(r.Driver)).join(" · ") : "None",
  });

  return (
    <>
      <Card style={{ paddingVertical: 4 }}>
        <StatRows stats={stats} />
      </Card>

      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingBottom: 6,
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.line,
          }}
        >
          <Label style={{ width: COLUMNS.pos }}>POS</Label>
          <Label style={{ width: COLUMNS.delta }}>+/-</Label>
          <Label style={{ flex: 1 }}>DRIVER</Label>
          <Label style={{ width: COLUMNS.time, textAlign: "right" }}>TIME</Label>
          <Label style={{ width: COLUMNS.pts, textAlign: "right" }}>PTS</Label>
        </View>

        {results.map((result) => {
          const classified = isClassified(result);
          const isFastest = result === fastest;
          const timeColor = !classified
            ? Theme.colors.loss
            : isFastest
            ? Theme.colors.purple
            : result.Time?.time
            ? Theme.colors.text
            : Theme.colors.muted;
          const points = Number(result.points);

          return (
            <Pressable
              key={result.Driver.driverId}
              onPress={() => navigation.navigate("Driver", { driverId: result.Driver.driverId })}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                minHeight: 48,
                borderBottomWidth: 1,
                borderBottomColor: Theme.colors.lineSoft,
                backgroundColor: pressed ? Theme.colors.surface : "transparent",
              })}
            >
              <AppText mono weight="bold" size={14} style={{ width: COLUMNS.pos }}>
                {classified ? result.position : getStatusLabel(result)}
              </AppText>
              <Delta gained={getPlacesGained(result, size)} classified={classified} />
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0 }}>
                <TeamBar color={getTeamColor(result.Constructor.constructorId)} height={26} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText size={14} weight="bold" numberOfLines={1}>
                    <AppText mono weight="bold" size={14}>
                      {getDriverCode(result.Driver)}
                    </AppText>{" "}
                    <AppText size={14} color={Theme.colors.muted}>
                      {result.Driver.familyName}
                    </AppText>
                  </AppText>
                  <AppText size={11} color={Theme.colors.muted} numberOfLines={1}>
                    {result.Constructor.name}
                  </AppText>
                </View>
              </View>
              <AppText
                mono
                size={12}
                numberOfLines={1}
                color={timeColor}
                style={{ width: COLUMNS.time, textAlign: "right" }}
              >
                {classified ? getGapToLeader(result, leader) : result.status}
              </AppText>
              <AppText
                mono
                weight="bold"
                size={13}
                style={{ width: COLUMNS.pts, textAlign: "right" }}
              >
                {points > 0 ? result.points : ""}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AdBanner adUnitId={AD_BANNER_RACE_RESULT_1_ID} />
    </>
  );
};
