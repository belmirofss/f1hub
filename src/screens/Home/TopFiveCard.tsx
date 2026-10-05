import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, InlineLink, TeamBar } from "../../components/Card";
import { FormChips, FormLegend } from "../../components/FormChips";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { useRecentForm } from "../../hooks/useRecentForm";
import { getDriverCode, getTeamColor } from "../../helpers/teams";

export const TopFiveCard = () => {
  const navigation = useNavigation();
  const { data, isLoading, isError, refetch } = useSeasonDriverStandings({ season: "current" });
  const list = data?.MRData.StandingsTable.StandingsLists[0];
  const form = useRecentForm({ season: list?.season, lastRound: list?.round });

  // Wait for the form squares too, so the rows don't shift when they arrive
  if (isLoading || form.isLoading) return <Card><Loading /></Card>;
  if (isError) return <Card><Error onRetry={refetch} /></Card>;
  if (!list?.DriverStandings.length) return null;

  return (
    <Card style={{ gap: 4 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Label>TOP 5 · LAST 5 RACES</Label>
        <InlineLink onPress={() => navigation.navigate("Standings")}>All</InlineLink>
      </View>

      {list.DriverStandings.slice(0, 5).map((standing) => (
        <View
          key={standing.Driver.driverId}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            borderTopWidth: 1,
            borderTopColor: Theme.colors.lineSoft,
          }}
        >
          <AppText mono weight="bold" size={14} style={{ width: 18 }}>
            {standing.position}
          </AppText>
          <TeamBar color={getTeamColor(standing.Constructors.at(-1)?.constructorId)} height={24} />
          <AppText size={15} weight="bold" style={{ flex: 1 }}>
            {getDriverCode(standing.Driver)}
          </AppText>
          <FormChips form={form.drivers[standing.Driver.driverId]} />
          <AppText mono weight="bold" size={14} style={{ width: 40, textAlign: "right" }}>
            {standing.points}
          </AppText>
        </View>
      ))}
      <View style={{ borderTopWidth: 1, borderTopColor: Theme.colors.lineSoft, paddingTop: 10 }}>
        <FormLegend />
      </View>
    </Card>
  );
};
