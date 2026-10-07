import { useState } from "react";
import { Pressable, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, EmptyState, TeamBar } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { SplitBar } from "../../components/SplitBar";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useTeammates } from "../../hooks/useTeammates";
import { Score, TeammatePair } from "../../helpers/headToHead";
import { getDriverCode, getTeamColor } from "../../helpers/teams";
import { Driver } from "../../types";

const Metric = ({ label, score, color }: { label: string; score: Score; color: string }) => {
  const [a, b] = score;
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${a} to ${b}`}
      style={{ gap: 6 }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <AppText mono weight="bold" size={15} color={a > b ? Theme.colors.text : Theme.colors.muted} style={{ width: 64 }}>
          {+a.toFixed(1)}
        </AppText>
        <Label style={{ flex: 1, textAlign: "center", fontSize: 10 }}>{label}</Label>
        <AppText
          mono
          weight="bold"
          size={15}
          color={b > a ? Theme.colors.text : Theme.colors.muted}
          style={{ width: 64, textAlign: "right" }}
        >
          {+b.toFixed(1)}
        </AppText>
      </View>
      <SplitBar a={a} b={b} color={color} />
    </View>
  );
};

const Name = ({ driver, align }: { driver: Driver; align: "left" | "right" }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("Driver", { driverId: driver.driverId })}
      accessibilityRole="link"
      style={{ flex: 1, alignItems: align === "left" ? "flex-start" : "flex-end" }}
    >
      <AppText size={13} color={Theme.colors.muted}>
        {driver.givenName}
      </AppText>
      <View style={{ transform: [{ skewX: "-6deg" }] }}>
        <AppText size={22} weight="black" numberOfLines={1} adjustsFontSizeToFit style={{ lineHeight: 26 }}>
          {driver.familyName.toUpperCase()}
        </AppText>
      </View>
    </Pressable>
  );
};

const PairCard = ({ pair }: { pair: TeammatePair }) => {
  const color = getTeamColor(pair.team.constructorId);
  const gap = pair.qualifyingGapMs;
  const faster = gap === undefined ? undefined : gap <= 0 ? pair.a : pair.b;

  return (
    <Card style={{ gap: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TeamBar color={color} height={16} />
        <Label color={Theme.colors.text}>{pair.team.name.toUpperCase()}</Label>
        <Label style={{ marginLeft: "auto" }}>{pair.rounds} RACES TOGETHER</Label>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Name driver={pair.a} align="left" />
        <AppText mono size={12} color={Theme.colors.subtle} style={{ paddingHorizontal: 10 }}>
          VS
        </AppText>
        <Name driver={pair.b} align="right" />
      </View>
      <Metric label="QUALIFYING" score={pair.qualifying} color={color} />
      <Metric label="RACE" score={pair.race} color={color} />
      <Metric label="POINTS" score={pair.points} color={color} />
      <Metric label="PODIUMS" score={pair.podiums} color={color} />
      {faster && gap !== undefined && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: 10,
            backgroundColor: Theme.colors.surfaceRaised,
          }}
        >
          <Ionicons name="stopwatch-outline" size={18} color={Theme.colors.purple} />
          <AppText size={13} color="#C9C9D0" style={{ flex: 1 }}>
            Average qualifying gap
          </AppText>
          <AppText mono weight="bold" size={13} color={Theme.colors.purple}>
            {getDriverCode(faster)} −{(Math.abs(gap) / 1000).toFixed(3)}s
          </AppText>
        </View>
      )}
    </Card>
  );
};

type Props = {
  season: string;
  initialTeam?: string;
};

// Every team's two drivers compared; tap a team to see its full battle
export const Teammates = ({ season, initialTeam }: Props) => {
  const { pairs, isLoading, isError, refetch } = useTeammates({ season });
  const [selected, setSelected] = useState(initialTeam);

  if (isLoading) return <Loading />;
  if (isError) return <Error onRetry={refetch} />;
  if (!pairs.length) return <EmptyState>The season hasn't started yet.</EmptyState>;

  const pair = pairs.find((p) => p.team.constructorId === selected) ?? pairs[0];

  return (
    <>
      <PairCard pair={pair} />
      <View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            paddingBottom: 6,
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.line,
          }}
        >
          <Label style={{ flex: 1 }}>TEAM</Label>
          <Label>QUALIFYING</Label>
        </View>
        {pairs.map((p) => {
          const on = p === pair;
          const color = getTeamColor(p.team.constructorId);
          return (
            <Pressable
              key={p.team.constructorId}
              onPress={() => setSelected(p.team.constructorId)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                minHeight: 52,
                paddingHorizontal: 4,
                borderBottomWidth: 1,
                borderBottomColor: Theme.colors.lineSoft,
                backgroundColor: on || pressed ? Theme.colors.surface : "transparent",
              })}
            >
              <TeamBar color={color} height={28} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText size={15} weight="bold" numberOfLines={1}>
                  {p.team.name}
                </AppText>
                <AppText mono size={10} color={Theme.colors.muted}>
                  {getDriverCode(p.a)} vs {getDriverCode(p.b)}
                </AppText>
              </View>
              <View style={{ width: 96 }}>
                <SplitBar a={p.qualifying[0]} b={p.qualifying[1]} color={color} />
              </View>
              <AppText mono weight="bold" size={13} style={{ width: 44, textAlign: "right" }}>
                {p.qualifying[0]}–{p.qualifying[1]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

type ParamList = {
  Teammates: { season: string; constructorId?: string };
};

export const TeammatesScreen = () => {
  const { params } = useRoute<RouteProp<ParamList, "Teammates">>();
  return (
    <Screen showBack title="Teammates" meta={params.season === "current" ? undefined : params.season}>
      <Teammates season={params.season} initialTeam={params.constructorId} />
    </Screen>
  );
};
