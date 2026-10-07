import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { EmptyState, TeamBar } from "../../components/Card";
import { FormChips, FormLegend } from "../../components/FormChips";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { useSeasonConstructorStandings } from "../../hooks/useSeasonConstructorStandings";
import { useRecentForm } from "../../hooks/useRecentForm";
import { getDriverName, getTeamColor } from "../../helpers/teams";
import { StandingType } from "../../types";

type Row = {
  id: string;
  position: string;
  name: string;
  team?: string;
  color: string;
  points: number;
};

type Props = {
  season: string;
  type: StandingType;
};

export const StandingsTable = ({ season, type }: Props) => {
  const navigation = useNavigation();
  const drivers = useSeasonDriverStandings({ season });
  const constructors = useSeasonConstructorStandings({ season });
  const query = type === StandingType.DRIVERS ? drivers : constructors;

  const driverList = drivers.data?.MRData.StandingsTable.StandingsLists[0];
  const constructorList = constructors.data?.MRData.StandingsTable.StandingsLists[0];
  const list = driverList ?? constructorList;
  const form = useRecentForm({ season: list?.season, lastRound: list?.round });

  // Wait for the form squares too, so the rows don't shift when they arrive
  if (query.isLoading || form.isLoading) return <Loading />;
  if (query.isError) return <Error onRetry={query.refetch} />;

  const rows: Row[] =
    type === StandingType.DRIVERS
      ? (driverList?.DriverStandings ?? []).map((s) => ({
          id: s.Driver.driverId,
          position: s.positionText === "-" ? "–" : s.position,
          name: getDriverName(s.Driver),
          team: s.Constructors.at(-1)?.name,
          color: getTeamColor(s.Constructors.at(-1)?.constructorId),
          points: Number(s.points),
        }))
      : (constructorList?.ConstructorStandings ?? []).map((s) => ({
          id: s.Constructor.constructorId,
          position: s.position,
          name: s.Constructor.name,
          color: getTeamColor(s.Constructor.constructorId),
          points: Number(s.points),
        }));

  if (!rows.length) {
    return <EmptyState>The season hasn't started yet.</EmptyState>;
  }

  const forms = type === StandingType.DRIVERS ? form.drivers : form.teams;
  const leader = rows[0].points;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingBottom: 6,
          borderBottomWidth: 1,
          borderBottomColor: Theme.colors.line,
        }}
      >
        <Label style={{ width: 24 }}>P</Label>
        <Label style={{ flex: 1 }}>{type === StandingType.DRIVERS ? "DRIVER" : "TEAM"}</Label>
        <Label>{type === StandingType.DRIVERS ? "LAST 5" : "BEST · LAST 5"}</Label>
        <Label style={{ width: 44, textAlign: "right" }}>PTS</Label>
      </View>

      {rows.map((row, index) => {
        const gap = index === 0 ? "LEADER" : `-${+(leader - row.points).toFixed(1)}`;
        return (
          <Pressable
            key={row.id}
            onPress={() =>
              type === StandingType.DRIVERS
                ? navigation.navigate("Driver", { driverId: row.id })
                : navigation.navigate("Team", { constructorId: row.id })
            }
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minHeight: 54,
              borderBottomWidth: 1,
              borderBottomColor: Theme.colors.lineSoft,
              backgroundColor: pressed ? Theme.colors.surface : "transparent",
            })}
          >
            <AppText mono weight="bold" size={14} style={{ width: 24 }}>
              {row.position}
            </AppText>
            <TeamBar color={row.color} height={30} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText size={15} weight="bold" numberOfLines={1}>
                {row.name}
              </AppText>
              <AppText mono size={10} color={Theme.colors.muted} numberOfLines={1}>
                {row.team ? `${row.team} · ${gap}` : gap}
              </AppText>
            </View>
            <FormChips form={forms[row.id]} size={18} />
            <AppText mono weight="bold" size={15} style={{ width: 44, textAlign: "right" }}>
              {row.points}
            </AppText>
          </Pressable>
        );
      })}
      <View style={{ paddingTop: 12 }}>
        <FormLegend />
      </View>
    </View>
  );
};
