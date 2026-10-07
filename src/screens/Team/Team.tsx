import { Pressable, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, LinkCard, TeamBar } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { StatGrid } from "../../components/StatGrid";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { useConstructor } from "../../hooks/useConstructor";
import { useConstructorSeasonPositions } from "../../hooks/useConstructorSeasonPositions";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { useSeasonResults } from "../../hooks/useSeasonResults";
import { useSeasonSprintResults } from "../../hooks/useSeasonSprintResults";
import { useTeammates } from "../../hooks/useTeammates";
import { CHAMPIONS } from "../../data/champions";
import { getConstructorTitles } from "../../data/constructorChampions";
import { getDriverCode, getDriverName, getTeamColor } from "../../helpers/teams";
import { Constructor } from "../../types";

type ParamList = {
  Team: { constructorId: string };
};

const CHART_HEIGHT = 110;

const Drivers = ({ team, season }: { team: Constructor; season: string }) => {
  const navigation = useNavigation();
  const standings = useSeasonDriverStandings({ season });
  const color = getTeamColor(team.constructorId);
  const drivers = (standings.data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []).filter(
    (s) => s.Constructors.some((c) => c.constructorId === team.constructorId)
  );
  if (!drivers.length) return null;

  return (
    <Card style={{ gap: 0, paddingBottom: 4 }}>
      <Label style={{ paddingBottom: 8 }}>DRIVERS · {season}</Label>
      {drivers.map((standing) => (
        <Pressable
          key={standing.Driver.driverId}
          onPress={() => navigation.navigate("Driver", { driverId: standing.Driver.driverId })}
          accessibilityRole="button"
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minHeight: 58,
            borderTopWidth: 1,
            borderTopColor: Theme.colors.lineSoft,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Theme.colors.surfaceRaised,
              borderWidth: 1,
              borderColor: Theme.colors.line,
            }}
          >
            <AppText mono weight="bold" size={11} color={color}>
              {getDriverCode(standing.Driver)}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText size={15} weight="bold">
              {getDriverName(standing.Driver)}
            </AppText>
            <AppText mono size={10} color={Theme.colors.muted}>
              P{standing.position} · {standing.wins} {standing.wins === "1" ? "WIN" : "WINS"}
            </AppText>
          </View>
          <AppText mono weight="bold" size={15}>
            {standing.points}
          </AppText>
          <Ionicons name="chevron-forward" size={16} color={Theme.colors.muted} />
        </Pressable>
      ))}
    </Card>
  );
};

// Race + sprint points of the team's two main drivers, round by round
const PointsPerRound = ({ team, season }: { team: Constructor; season: string }) => {
  const results = useSeasonResults({ season });
  const sprints = useSeasonSprintResults({ season });
  const { pairs } = useTeammates({ season });
  const pair = pairs.find((p) => p.team.constructorId === team.constructorId);
  if (!pair || !results.data) return null;

  const color = getTeamColor(team.constructorId);
  const sprintPoints = new Map(
    (sprints.data ?? []).flatMap((race) =>
      (race.SprintResults ?? []).map((r) => [`${race.round}-${r.Driver.driverId}`, Number(r.points)])
    )
  );
  const rounds = results.data.map((race) => {
    const points = (driverId: string) =>
      Number(race.Results?.find((r) => r.Driver.driverId === driverId)?.points ?? 0) +
      (sprintPoints.get(`${race.round}-${driverId}`) ?? 0);
    return { round: race.round, a: points(pair.a.driverId), b: points(pair.b.driverId) };
  });
  const max = Math.max(1, ...rounds.map((r) => r.a + r.b));

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Label>POINTS PER ROUND · {season}</Label>
        <Label>
          {getDriverCode(pair.a)} / {getDriverCode(pair.b)}
        </Label>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3, height: CHART_HEIGHT }}>
        {rounds.map((r) => (
          <View
            key={r.round}
            accessible
            accessibilityLabel={`Round ${r.round}: ${pair.a.familyName} ${r.a}, ${pair.b.familyName} ${r.b}`}
            style={{ flex: 1, justifyContent: "flex-end", height: "100%" }}
          >
            <View
              style={{
                height: (r.b / max) * CHART_HEIGHT,
                backgroundColor: color,
                opacity: 0.45,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
            <View style={{ height: (r.a / max) * CHART_HEIGHT, backgroundColor: color, marginTop: r.b ? 1 : 0 }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText mono size={10} color={Theme.colors.muted}>
          R1
        </AppText>
        <AppText mono size={10} color={Theme.colors.muted}>
          R{rounds.length}
        </AppText>
      </View>
      <View style={{ flexDirection: "row", gap: 14 }}>
        {[
          { name: pair.a.familyName, opacity: 1 },
          { name: pair.b.familyName, opacity: 0.45 },
        ].map((item) => (
          <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, opacity: item.opacity }} />
            <AppText size={12} color={Theme.colors.muted}>
              {item.name}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
};

export const Team = () => {
  const { params } = useRoute<RouteProp<ParamList, "Team">>();
  const { constructorId } = params;
  const navigation = useNavigation();
  const { accent, onAccent } = useSettings();
  const team = useConstructor({ constructorId });
  const recentSeasons = (team.data?.seasons ?? []).slice(-6);
  const history = useConstructorSeasonPositions({ constructorId, seasons: recentSeasons });

  if (team.isLoading) return <Screen showBack><Loading /></Screen>;
  if (team.isError || !team.data?.constructor) {
    return <Screen showBack><Error onRetry={team.refetch} /></Screen>;
  }

  const { constructor, seasons, wins } = team.data;
  const latest = seasons.at(-1);
  const color = getTeamColor(constructorId);
  const titles = getConstructorTitles(constructorId);
  const driverTitles = CHAMPIONS.filter((c) => c.teamId === constructorId).length;

  return (
    <Screen showBack meta={latest ? `TEAM · ${latest}` : "TEAM"}>
      <View style={{ flexDirection: "row", gap: 14, alignItems: "stretch" }}>
        <TeamBar color={color} height={56} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ transform: [{ skewX: "-6deg" }] }}>
            <AppText size={34} weight="black" numberOfLines={1} adjustsFontSizeToFit style={{ lineHeight: 38 }}>
              {constructor.name.toUpperCase()}
            </AppText>
          </View>
          <Label>
            {constructor.nationality.toUpperCase()}
            {seasons[0] ? ` · SINCE ${seasons[0]}` : ""}
          </Label>
        </View>
      </View>

      {titles.length > 0 && (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 }}>
          <Ionicons name="trophy-outline" size={18} color={accent} />
          <AppText size={14} weight="bold">
            {titles.includes(latest ?? "")
              ? `${latest} Constructors' Champions`
              : `${titles.length}× Constructors' Champions`}
          </AppText>
        </Card>
      )}

      {latest && <Drivers team={constructor} season={latest} />}

      <Card>
        <Label>ALL TIME</Label>
        <StatGrid
          stats={[
            { label: "TEAM TITLES", value: titles.length },
            { label: "DRIVER TITLES", value: driverTitles },
            { label: "WINS", value: wins },
            { label: "SEASONS", value: seasons.length },
          ]}
        />
      </Card>

      {latest && <PointsPerRound team={constructor} season={latest} />}

      {!history.isLoading && history.positions.some((p) => p.position > 0) && (
        <Card>
          <Label>CONSTRUCTORS' POSITION</Label>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {history.positions.map(({ season, position }) => {
              const won = position === 1;
              return (
                <View
                  key={season}
                  accessible
                  accessibilityLabel={`${season}: ${position ? `P${position}` : "no data"}`}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: 6,
                    paddingVertical: 10,
                    borderRadius: Theme.radius.m,
                    backgroundColor: won ? accent : Theme.colors.surfaceRaised,
                  }}
                >
                  <AppText mono weight="bold" size={16} color={won ? onAccent : Theme.colors.text}>
                    {position ? `P${position}` : "–"}
                  </AppText>
                  <AppText mono size={10} color={won ? onAccent : Theme.colors.muted}>
                    '{season.slice(2)}
                  </AppText>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {latest && (
        <LinkCard
          onPress={() => navigation.navigate("Teammates", { season: latest, constructorId })}
          accessibilityLabel="Teammate battle"
        >
          <Label>TEAMMATE BATTLE · {latest}</Label>
          <AppText size={15} weight="bold">
            Qualifying, race and points head-to-head
          </AppText>
        </LinkCard>
      )}
    </Screen>
  );
};
