import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
    </Screen>
  );
};
