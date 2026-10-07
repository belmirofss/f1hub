import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText } from "../../components/AppText";
import { IconButton } from "../../components/Card";
import { Screen } from "../../components/Screen";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_HOME_ID } from "../../constants";
import { useSettings } from "../../settings/SettingsContext";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";
import { useNow } from "../../hooks/useNow";
import { NextSessionTicker } from "./NextSessionTicker";
import { NextRaceCard } from "./NextRaceCard";
import { LastRaceCard } from "./LastRaceCard";
import { TopFiveCard } from "./TopFiveCard";
import { TeammateSpotlightCard } from "./TeammateSpotlightCard";
import { TitleFightCard } from "../Standings/TitleFightCard";

const Wordmark = () => {
  const { accent } = useSettings();
  return (
    <View style={{ transform: [{ skewX: "-10deg" }] }}>
      <AppText size={26} weight="black" style={{ letterSpacing: -0.5 }}>
        F1<AppText size={26} weight="black" color={accent}>HUB</AppText>
      </AppText>
    </View>
  );
};

// Looks like a field but opens the search screen, where the real input lives
const SearchBar = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Search drivers, teams, circuits, races and seasons"
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      minHeight: 46,
      paddingHorizontal: 14,
      backgroundColor: pressed ? Theme.colors.surfaceRaised : Theme.colors.surface,
      borderColor: Theme.colors.line,
      borderWidth: 1,
      borderRadius: Theme.radius.l,
    })}
  >
    <Ionicons name="search" size={18} color={Theme.colors.muted} />
    <AppText color={Theme.colors.subtle} numberOfLines={1} style={{ flex: 1 }}>
      Drivers, teams, circuits, races, years
    </AppText>
  </Pressable>
);

export const Home = () => {
  const navigation = useNavigation();
  const now = useNow(30000);
  const schedule = useSeasonRaceSchedule({ season: "current" });
  const races = schedule.data?.MRData.RaceTable.Races ?? [];

  return (
    <Screen
      header={
        <View style={{ gap: Theme.space.s }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Wordmark />
            <IconButton
              icon="settings-outline"
              label="Settings"
              onPress={() => navigation.navigate("Settings")}
            />
          </View>
          <NextSessionTicker races={races} now={now} isLoading={schedule.isLoading} />
        </View>
      }
    >
      <SearchBar onPress={() => navigation.navigate("Search")} />
      <NextRaceCard
        races={races}
        now={now}
        isLoading={schedule.isLoading}
        isError={schedule.isError}
        onRetry={schedule.refetch}
      />
      <LastRaceCard />
      <AdBanner adUnitId={AD_BANNER_HOME_ID} />
      <TopFiveCard />
      <TitleFightCard compact />
      <TeammateSpotlightCard />
    </Screen>
  );
};
