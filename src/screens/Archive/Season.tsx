import { useState } from "react";
import { Pressable, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, EmptyState, TeamBar } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { Tabs } from "../../components/Segmented";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_ARCHIVE_2_ID } from "../../constants";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";
import { useSeasonWinners } from "../../hooks/useSeasonWinners";
import { CHAMPIONS } from "../../data/champions";
import { getTeamColor } from "../../helpers/teams";
import { getRaceStart } from "../../helpers/sessions";
import { formatShortDate } from "../../helpers/time";
import { StandingType } from "../../types";
import { StandingsTable } from "../Standings/StandingsTable";

type ParamList = {
  Season: { season: string };
};

type Tab = StandingType | "races";

const Races = ({ season }: { season: string }) => {
  const navigation = useNavigation();
  const schedule = useSeasonRaceSchedule({ season });
  const winners = useSeasonWinners({ season });

  if (schedule.isLoading || winners.isLoading) return <Loading />;
  if (schedule.isError) return <Error onRetry={schedule.refetch} />;

  const races = schedule.data?.MRData.RaceTable.Races ?? [];
  const winnerByRound = new Map(
    (winners.data?.MRData.RaceTable.Races ?? []).map((r) => [r.round, r.Results?.[0]])
  );

  if (!races.length) return <EmptyState>No races found for this season.</EmptyState>;

  return (
    <View>
      {races.map((race) => {
        const winner = winnerByRound.get(race.round);
        return (
          <Pressable
            key={race.round}
            onPress={() => navigation.navigate("RaceWeekend", { season, round: race.round })}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              minHeight: 54,
              borderBottomWidth: 1,
              borderBottomColor: Theme.colors.lineSoft,
              backgroundColor: pressed ? Theme.colors.surface : "transparent",
            })}
          >
            <AppText mono size={12} color={Theme.colors.muted} style={{ width: 24 }}>
              {race.round.padStart(2, "0")}
            </AppText>
            <View style={{ flex: 1 }}>
              <AppText size={15} weight="bold" numberOfLines={1}>
                {race.raceName}
              </AppText>
              <AppText mono size={10} color={Theme.colors.muted}>
                {formatShortDate(getRaceStart(race))}
              </AppText>
            </View>
            {winner && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <TeamBar color={getTeamColor(winner.Constructor.constructorId)} height={18} />
                <AppText size={13} weight="semibold">
                  {winner.Driver.familyName}
                </AppText>
              </View>
            )}
            <Ionicons name="chevron-forward" size={14} color={Theme.colors.muted} />
          </Pressable>
        );
      })}
    </View>
  );
};

export const Season = () => {
  const { params } = useRoute<RouteProp<ParamList, "Season">>();
  const { season } = params;
  const [tab, setTab] = useState<Tab>(StandingType.DRIVERS);
  const champion = CHAMPIONS.find((c) => c.season === season);

  return (
    <Screen
      showBack
      title={`Season ${season}`}
      meta={champion ? `${champion.rounds} ROUNDS` : undefined}
      header={
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: StandingType.DRIVERS, label: "Drivers" },
            { value: StandingType.CONSTRUCTORS, label: "Constructors" },
            { value: "races", label: "Races" },
          ]}
        />
      }
    >
      {champion && (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TeamBar color={getTeamColor(champion.teamId)} height={48} />
          <View style={{ flex: 1 }}>
            <Label>DRIVERS' CHAMPION</Label>
            <AppText size={18} weight="bold">
              {champion.driver}
            </AppText>
            <AppText size={12} color={Theme.colors.muted}>
              {champion.team} · {champion.wins} wins
            </AppText>
          </View>
          <AppText mono weight="bold" size={20}>
            {champion.points}
          </AppText>
        </Card>
      )}

      {tab === "races" ? <Races season={season} /> : <StandingsTable season={season} type={tab} />}

      <AdBanner adUnitId={AD_BANNER_ARCHIVE_2_ID} />
    </Screen>
  );
};
