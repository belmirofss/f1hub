import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment-timezone";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { EmptyState, IconButton } from "../../components/Card";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { useSearchIndex } from "../../hooks/useSearchIndex";
import { search, SearchItem, SearchTarget, SearchType, seasonItem } from "../../helpers/search";

type Filter = "all" | SearchType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "driver", label: "DRIVERS" },
  { value: "team", label: "TEAMS" },
  { value: "race", label: "RACES" },
  { value: "circuit", label: "CIRCUITS" },
  { value: "season", label: "SEASONS" },
];

const GROUPS: { type: SearchType; label: string }[] = [
  { type: "driver", label: "DRIVERS" },
  { type: "team", label: "TEAMS" },
  { type: "race", label: "RACES" },
  { type: "circuit", label: "CIRCUITS" },
  { type: "season", label: "SEASONS" },
];

const OPENS: Record<SearchType, string> = {
  driver: "DRIVER",
  team: "TEAM",
  race: "RACE WEEKEND",
  circuit: "CIRCUIT",
  season: "SEASON",
};

const ICONS: Partial<Record<SearchType, keyof typeof Ionicons.glyphMap>> = {
  race: "flag-outline",
  circuit: "map-outline",
};

// Rows per group before the "More" chip filters to that type
const GROUP_LIMIT = 4;
const RESULT_LIMIT = 50;

const RECENT_KEY = "SEARCH_RECENT";
const RECENT_LIMIT = 6;

const useNavigateTo = () => {
  const navigation = useNavigation();
  return (target: SearchTarget) => {
    switch (target.screen) {
      case "Driver":
        return navigation.navigate("Driver", target.params);
      case "Team":
        return navigation.navigate("Team", target.params);
      case "Circuit":
        return navigation.navigate("Circuit", target.params);
      case "RaceWeekend":
        return navigation.navigate("RaceWeekend", target.params);
      case "Season":
        return navigation.navigate("Season", target.params);
    }
  };
};

const Badge = ({ item, size = 36, icon }: { item: SearchItem; size?: number; icon?: keyof typeof Ionicons.glyphMap }) => {
  const name = icon ?? ICONS[item.type];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Theme.radius.m,
        backgroundColor: Theme.colors.surfaceRaised,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {item.color && (
        <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: item.color }} />
      )}
      {name ? (
        <Ionicons name={name} size={18} color={Theme.colors.muted} />
      ) : (
        <AppText mono weight="bold" size={item.type === "driver" ? 12 : 11}>
          {item.badge}
        </AppText>
      )}
    </View>
  );
};

const ResultRow = ({
  item,
  onPress,
  icon,
  first,
}: {
  item: SearchItem;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  first?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${item.title}, ${item.subtitle}. Opens ${OPENS[item.type].toLowerCase()}`}
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 56,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderTopWidth: 1,
      borderTopColor: first ? Theme.colors.line : Theme.colors.lineSoft,
      backgroundColor: pressed ? Theme.colors.surface : "transparent",
    })}
  >
    <Badge item={item} icon={icon} />
    <View style={{ flex: 1, minWidth: 0 }}>
      <AppText size={16} weight="bold" numberOfLines={1}>
        {item.title}
      </AppText>
      {!!item.subtitle && (
        <AppText size={13} color={Theme.colors.muted} numberOfLines={1}>
          {item.subtitle}
        </AppText>
      )}
    </View>
    {item.meta && (
      <AppText mono weight="bold" size={12} color={Theme.colors.muted} numberOfLines={1}>
        {item.meta}
      </AppText>
    )}
    <Ionicons name="chevron-forward" size={16} color={Theme.colors.subtle} />
  </Pressable>
);

// The search key on the keyboard opens this one
const TopHit = ({ item, onPress }: { item: SearchItem; onPress: () => void }) => {
  const { accent } = useSettings();
  return (
    <View>
      <Label style={{ paddingBottom: 6 }}>TOP HIT</Label>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.subtitle}. Opens ${OPENS[item.type].toLowerCase()}`}
        style={({ pressed }) => ({
          gap: 10,
          padding: 12,
          borderRadius: Theme.radius.l,
          borderWidth: 1,
          borderColor: pressed ? Theme.colors.lineDashed : Theme.colors.line,
          backgroundColor: pressed ? Theme.colors.surfaceRaised : Theme.colors.surface,
        })}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Badge item={item} size={44} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText size={22} weight="black" numberOfLines={1} adjustsFontSizeToFit>
              {item.title}
            </AppText>
            {!!item.subtitle && (
              <AppText size={13} color={Theme.colors.muted} numberOfLines={1}>
                {item.subtitle}
              </AppText>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTopWidth: 1,
            borderStyle: "dashed",
            borderTopColor: Theme.colors.lineDashed,
          }}
        >
          <Label>OPENS {OPENS[item.type]}</Label>
          <AppText mono weight="bold" size={11} color={accent} style={{ letterSpacing: 1 }}>
            GO →
          </AppText>
        </View>
      </Pressable>
    </View>
  );
};

const Chip = ({ label, count, on, onPress }: { label: string; count?: number; on: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: on }}
    accessibilityLabel={count === undefined ? label : `${label}, ${count} results`}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 32,
      paddingHorizontal: 12,
      borderRadius: Theme.radius.m,
      borderWidth: 1,
      borderColor: on ? Theme.colors.lineDashed : Theme.colors.line,
      backgroundColor: on ? Theme.colors.surfaceRaised : "transparent",
    }}
  >
    <AppText mono weight="bold" size={12} color={on ? Theme.colors.text : Theme.colors.muted}>
      {label}
    </AppText>
    {count !== undefined && (
      <AppText mono size={12} color={on ? Theme.colors.muted : Theme.colors.subtle}>
        {count}
      </AppText>
    )}
  </Pressable>
);

export const Search = () => {
  const insets = useSafeAreaInsets();
  const navigateTo = useNavigateTo();
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [recent, setRecent] = useState<SearchItem[]>([]);
  const deferred = useDeferredValue(query);
  const year = deferred.match(/\b(19[5-9]\d|20\d\d)\b/)?.[1];
  const { index, isLoading, isError, refetch } = useSearchIndex(year);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY)
      .then((value) => value && setRecent(JSON.parse(value)))
      .catch(() => {});
  }, []);

  const results = useMemo(() => (deferred.trim() ? search(deferred, index) : []), [deferred, index]);
  const shown = filter === "all" ? results : results.filter((r) => r.type === filter);
  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", results.length]]);
    results.forEach((r) => map.set(r.type, (map.get(r.type) ?? 0) + 1));
    return map;
  }, [results]);

  const open = (item: SearchItem) => {
    const next = [item, ...recent.filter((r) => r.key !== item.key)].slice(0, RECENT_LIMIT);
    setRecent(next);
    AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
    navigateTo(item.target);
  };

  const clearRecent = () => {
    setRecent([]);
    AsyncStorage.removeItem(RECENT_KEY).catch(() => {});
  };

  const onChange = (text: string) => {
    setQuery(text);
    setFilter("all");
  };

  const today = moment().format("YYYY-MM-DD");
  const nextRace = index.currentRaces.find((r) => r.date >= today);
  const shortcuts: SearchItem[] = [
    ...(nextRace
      ? [
          {
            key: "next-race",
            type: "race" as const,
            title: nextRace.raceName,
            subtitle: `Next race · ${moment(nextRace.date).format("D MMM")}`,
            meta: `R${nextRace.round}`,
            target: { screen: "RaceWeekend" as const, params: { season: nextRace.season, round: nextRace.round } },
          },
        ]
      : []),
    ...(index.currentSeason ? [seasonItem(index.currentSeason, index.currentSeason)] : []),
  ];

  const top = filter === "all" ? shown[0] : undefined;
  const rest = top ? shown.slice(1) : shown;

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <View style={{ paddingTop: insets.top + 8, paddingRight: Theme.space.m, paddingLeft: 6, gap: Theme.space.s }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconButton icon="chevron-back" label="Back" bordered={false} onPress={() => navigation.goBack()} />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minHeight: 46,
              paddingHorizontal: 12,
              backgroundColor: Theme.colors.surface,
              borderColor: Theme.colors.line,
              borderWidth: 1,
              borderRadius: Theme.radius.l,
            }}
          >
            <Ionicons name="search" size={18} color={Theme.colors.muted} />
            <TextInput
              value={query}
              onChangeText={onChange}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Drivers, teams, circuits, races, years"
              placeholderTextColor={Theme.colors.subtle}
              accessibilityLabel="Search drivers, teams, circuits, races and seasons"
              returnKeyType="search"
              onSubmitEditing={() => shown[0] && open(shown[0])}
              style={{
                flex: 1,
                color: Theme.colors.text,
                fontFamily: Theme.fonts.semibold,
                fontSize: 16,
                paddingVertical: 8,
              }}
            />
            {!!query && (
              <Pressable onPress={() => onChange("")} accessibilityLabel="Clear search" hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={Theme.colors.muted} />
              </Pressable>
            )}
          </View>
        </View>
        {!!deferred.trim() && results.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 6, paddingLeft: 10 }}
          >
            {FILTERS.filter((f) => f.value === "all" || counts.get(f.value) || filter === f.value).map((f) => (
              <Chip
                key={f.value}
                label={f.label}
                count={counts.get(f.value) ?? 0}
                on={filter === f.value}
                onPress={() => setFilter(f.value)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: Theme.space.m, paddingTop: Theme.space.s, gap: 18, paddingBottom: Theme.space.l }}
      >
        {!deferred.trim() ? (
          <>
            {recent.length > 0 && (
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 6 }}>
                  <Label>RECENT</Label>
                  <Pressable onPress={clearRecent} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear recent searches">
                    <Label>CLEAR</Label>
                  </Pressable>
                </View>
                {recent.map((item, i) => (
                  <ResultRow key={item.key} item={item} first={i === 0} onPress={() => open(item)} />
                ))}
              </View>
            )}
            {shortcuts.length > 0 && (
              <View>
                <Label style={{ paddingBottom: 6 }}>JUMP TO</Label>
                {shortcuts.map((item, i) => (
                  <ResultRow key={item.key} item={item} first={i === 0} onPress={() => open(item)} />
                ))}
              </View>
            )}
            <AppText size={13} color={Theme.colors.muted} style={{ lineHeight: 19 }}>
              Search by name, code (VER), year (2021) or a place and a year (monaco 2024).
            </AppText>
          </>
        ) : (
          <>
            {top && <TopHit item={top} onPress={() => open(top)} />}
            {GROUPS.map(({ type, label }) => {
              const list = rest.filter((r) => r.type === type);
              if (!list.length) return null;
              const limit = filter === "all" ? GROUP_LIMIT : RESULT_LIMIT;
              return (
                <View key={type}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 6 }}>
                    <Label>{label}</Label>
                    {list.length > limit && filter === "all" && (
                      <Pressable onPress={() => setFilter(type)} hitSlop={10} accessibilityRole="button">
                        <Label>{list.length - limit} MORE →</Label>
                      </Pressable>
                    )}
                  </View>
                  {list.slice(0, limit).map((item, i) => (
                    <ResultRow key={item.key} item={item} first={i === 0} onPress={() => open(item)} />
                  ))}
                </View>
              );
            })}
            {isLoading && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <ActivityIndicator size="small" color={Theme.colors.muted} />
                <AppText size={13} color={Theme.colors.muted}>
                  Loading every driver, team and circuit…
                </AppText>
              </View>
            )}
            {!isLoading && isError && <Error onRetry={refetch} />}
            {!isLoading && !isError && !shown.length && (
              <EmptyState>{`Nothing for “${deferred.trim()}”. Try a surname, a code like LEC, or a place and a year like spa 2023.`}</EmptyState>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};
