import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { EmptyState } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_ARCHIVE_1_ID } from "../../constants";
import { useSeasons } from "../../hooks/useSeasons";
import { CHAMPIONS } from "../../data/champions";
import { getTeamColor } from "../../helpers/teams";

const PAGE = 12;

export const Archive = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const seasons = useSeasons();

  const championBySeason = useMemo(
    () => new Map(CHAMPIONS.map((c) => [c.season, c])),
    []
  );

  const rows = useMemo(() => {
    const list = [...(seasons.data ?? [])]
      .reverse()
      .map((s) => ({ season: s.season, champion: championBySeason.get(s.season) }));
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      ({ season, champion }) =>
        season.includes(term) ||
        champion?.driver.toLowerCase().includes(term) ||
        champion?.team.toLowerCase().includes(term)
    );
  }, [seasons.data, championBySeason, query]);

  const visible = showAll || query ? rows : rows.slice(0, PAGE);
  const openSeason = (season: string) => navigation.navigate("Season", { season });

  return (
    <Screen
      title="Archive"
      header={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minHeight: 46,
            paddingHorizontal: 14,
            backgroundColor: Theme.colors.surface,
            borderColor: Theme.colors.line,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Ionicons name="search" size={18} color={Theme.colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Year, champion or team"
            placeholderTextColor={Theme.colors.muted}
            accessibilityLabel="Search the archive"
            returnKeyType="search"
            style={{
              flex: 1,
              color: Theme.colors.text,
              fontFamily: Theme.fonts.regular,
              fontSize: 15,
              paddingVertical: 8,
            }}
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")} accessibilityLabel="Clear search" hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={Theme.colors.muted} />
            </Pressable>
          )}
        </View>
      }
    >
      {seasons.isLoading ? (
        <Loading />
      ) : seasons.isError ? (
        <Error onRetry={seasons.refetch} />
      ) : (
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
            <Label style={{ width: 48 }}>YEAR</Label>
            <Label style={{ flex: 1 }}>CHAMPION</Label>
            <Label>TEAM</Label>
          </View>
          {visible.length === 0 && <EmptyState>No seasons match your search.</EmptyState>}
          {visible.map(({ season, champion }) => (
            <Pressable
              key={season}
              onPress={() => openSeason(season)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                minHeight: 50,
                borderBottomWidth: 1,
                borderBottomColor: Theme.colors.lineSoft,
                backgroundColor: pressed ? Theme.colors.surface : "transparent",
              })}
            >
              <AppText mono weight="bold" size={15} style={{ width: 48 }}>
                {season}
              </AppText>
              <AppText
                size={15}
                weight="bold"
                numberOfLines={1}
                color={champion ? Theme.colors.text : Theme.colors.muted}
                style={{ flex: 1 }}
              >
                {champion?.driver ?? "In progress"}
              </AppText>
              {champion && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 120 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: getTeamColor(champion.teamId),
                    }}
                  />
                  <AppText size={12} color={Theme.colors.muted} numberOfLines={1}>
                    {champion.team}
                  </AppText>
                </View>
              )}
              <Ionicons name="chevron-forward" size={14} color={Theme.colors.muted} />
            </Pressable>
          ))}
          {!query && !showAll && rows.length > PAGE && (
            <Pressable
              onPress={() => setShowAll(true)}
              accessibilityRole="button"
              style={{
                marginTop: 10,
                minHeight: 44,
                borderRadius: Theme.radius.m,
                borderWidth: 1,
                borderColor: Theme.colors.line,
                backgroundColor: Theme.colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText weight="semibold">
                Show all {rows.length} seasons
              </AppText>
            </Pressable>
          )}
        </View>
      )}

      <AdBanner adUnitId={AD_BANNER_ARCHIVE_1_ID} />
    </Screen>
  );
};
