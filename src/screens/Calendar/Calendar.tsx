import { useMemo, useRef } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText } from "../../components/AppText";
import { Screen } from "../../components/Screen";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { EmptyState } from "../../components/Card";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_CALENDAR_ID } from "../../constants";
import { useSettings } from "../../settings/SettingsContext";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";
import { useSeasonWinners } from "../../hooks/useSeasonWinners";
import { useNow } from "../../hooks/useNow";
import { getRaceStart, getWeekendStart } from "../../helpers/sessions";
import { formatDateRange } from "../../helpers/time";
import { getDriverCode, getTeamColor } from "../../helpers/teams";
import { getCountryCode3ByName } from "../../helpers/countries";
import { Race, Result } from "../../types";

const ROW_HEIGHT = 56;

type Row = {
  race: Race;
  winner?: Result;
  isNext: boolean;
  isPast: boolean;
};

export const Calendar = () => {
  const navigation = useNavigation();
  const { accent, onAccent } = useSettings();
  const now = useNow(60000);
  const listRef = useRef<FlatList<Row>>(null);

  const schedule = useSeasonRaceSchedule({ season: "current" });
  const winners = useSeasonWinners({ season: "current" });

  const races = schedule.data?.MRData.RaceTable.Races ?? [];
  const season = schedule.data?.MRData.RaceTable.season;
  // Winners drive the strip, the chips and which race is "next", so wait for
  // both requests instead of letting those pop in. A failed winners request
  // still shows the calendar, just without winners.
  const isLoading = schedule.isLoading || winners.isLoading;

  const rows = useMemo<Row[]>(() => {
    const winnerByRound = new Map(
      (winners.data?.MRData.RaceTable.Races ?? []).map((r) => [r.round, r.Results?.[0]])
    );
    let nextFound = false;
    return races.map((race) => {
      const winner = winnerByRound.get(race.round);
      const isPast = !!winner || getRaceStart(race).valueOf() + 3 * 3600000 < now;
      const isNext = !isPast && !nextFound;
      if (isNext) nextFound = true;
      return { race, winner, isNext, isPast };
    });
  }, [races, winners.data, now]);

  const nextIndex = rows.findIndex((r) => r.isNext);
  const doneCount = rows.filter((r) => r.isPast).length;

  const teamWins = useMemo(() => {
    const counts = new Map<string, { name: string; color: string; wins: number }>();
    rows.forEach(({ winner }) => {
      if (!winner) return;
      const id = winner.Constructor.constructorId;
      const entry = counts.get(id) ?? {
        name: winner.Constructor.name,
        color: getTeamColor(id),
        wins: 0,
      };
      entry.wins++;
      counts.set(id, entry);
    });
    return [...counts.values()].sort((a, b) => b.wins - a.wins);
  }, [rows]);

  const scrollTo = (index: number) =>
    listRef.current?.scrollToIndex({ index, viewOffset: ROW_HEIGHT, animated: true });

  const header = !isLoading && rows.length > 0 && (
    <View style={{ gap: 10 }}>
      <View
        accessibilityLabel="Season strip, coloured by winning team"
        style={{ flexDirection: "row", gap: 2 }}
      >
        {rows.map(({ race, winner, isNext }, index) => (
          <Pressable
            key={race.round}
            onPress={() => scrollTo(index)}
            accessibilityLabel={`Round ${race.round}, ${race.raceName}`}
            hitSlop={{ top: 8, bottom: 8 }}
            style={{
              flex: 1,
              height: 22,
              borderRadius: 3,
              backgroundColor: winner
                ? getTeamColor(winner.Constructor.constructorId)
                : isNext
                ? accent
                : "transparent",
              borderWidth: winner || isNext ? 0 : 1,
              borderColor: Theme.colors.lineDashed,
            }}
          />
        ))}
      </View>
      {teamWins.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 4 }}>
          {teamWins.map((team) => (
            <View key={team.name} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: team.color }} />
              <AppText mono size={10} color={Theme.colors.muted}>
                {team.name} {team.wins}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderRow = ({ item }: { item: Row }) => {
    const { race, winner, isNext } = item;
    const start = getWeekendStart(race);
    const end = getRaceStart(race);
    const chip = winner
      ? {
          text: getDriverCode(winner.Driver),
          bg: getTeamColor(winner.Constructor.constructorId),
          fg: Theme.colors.background,
        }
      : isNext
      ? { text: "NEXT", bg: accent, fg: onAccent }
      : undefined;

    return (
      <Pressable
        onPress={() => navigation.navigate("RaceWeekend", { season: race.season, round: race.round })}
        accessibilityRole="button"
        style={({ pressed }) => ({
          height: ROW_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: Theme.space.m,
          borderBottomWidth: 1,
          borderBottomColor: Theme.colors.lineSoft,
          backgroundColor: pressed
            ? Theme.colors.surface
            : isNext
            ? `${accent}1A`
            : "transparent",
        })}
      >
        <AppText mono size={12} color={Theme.colors.muted} style={{ width: 22 }}>
          {race.round.padStart(2, "0")}
        </AppText>
        <AppText mono weight="bold" size={12} style={{ width: 32 }}>
          {getCountryCode3ByName(race.Circuit.Location.country)}
        </AppText>
        <View style={{ flex: 1 }}>
          <AppText size={14} weight="bold" numberOfLines={1}>
            {race.raceName.replace("Grand Prix", "GP")}
          </AppText>
          <AppText mono size={10} color={Theme.colors.muted}>
            {formatDateRange(start, end)}
            {race.Sprint ? "  · SPRINT" : ""}
          </AppText>
        </View>
        {chip ? (
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 3,
              borderRadius: 4,
              backgroundColor: chip.bg,
            }}
          >
            <AppText mono weight="bold" size={11} color={chip.fg}>
              {chip.text}
            </AppText>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={14} color={Theme.colors.muted} />
        )}
      </Pressable>
    );
  };

  return (
    <Screen
      title="Calendar"
      meta={season && !isLoading ? `${season} · ${doneCount}/${races.length}` : undefined}
      header={header}
      scroll={false}
    >
      {isLoading ? (
        <Loading />
      ) : schedule.isError ? (
        <Error onRetry={schedule.refetch} />
      ) : (
        <FlatList
          ref={listRef}
          data={rows}
          keyExtractor={(row) => row.race.round}
          renderItem={renderRow}
          getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
          ListEmptyComponent={<EmptyState>The calendar for this season isn't out yet.</EmptyState>}
          ListFooterComponent={
            <View style={{ padding: Theme.space.m, paddingBottom: 96 }}>
              <AdBanner adUnitId={AD_BANNER_CALENDAR_ID} />
            </View>
          }
          style={{ borderTopWidth: 1, borderTopColor: Theme.colors.line }}
        />
      )}

      {!isLoading && nextIndex >= 0 && (
        <Pressable
          onPress={() => scrollTo(nextIndex)}
          accessibilityRole="button"
          accessibilityLabel={`Jump to the next race, ${rows[nextIndex].race.raceName}`}
          style={{
            position: "absolute",
            right: Theme.space.m,
            bottom: Theme.space.m,
            minHeight: 44,
            paddingHorizontal: 16,
            borderRadius: 22,
            backgroundColor: accent,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="arrow-down" size={16} color={onAccent} />
          <AppText weight="bold" size={14} color={onAccent}>
            Next: {rows[nextIndex].race.Circuit.Location.locality}
          </AppText>
        </Pressable>
      )}
    </Screen>
  );
};
