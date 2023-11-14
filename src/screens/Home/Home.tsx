import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { HomeNextRace } from "./HomeNextRace";
import { Theme } from "../../theme";
import { HomeLastRace } from "./HomeLastRace";
import { HomeStandings } from "./HomeStandings";
import { BuyMeACoffe } from "../../components/BuyMeACoffee";

export const Home = () => {
  return (
    <ScreenContainer title="Home">
      <View style={{ marginTop: Theme.space.xs }}>
        <HomeNextRace />
      </View>

      <View style={{ marginTop: Theme.space.xs }}>
        <HomeLastRace />
      </View>

      <View style={{ marginTop: Theme.space.xs }}>
        <HomeStandings />
      </View>

      <BuyMeACoffe />
    </ScreenContainer>
  );
};
