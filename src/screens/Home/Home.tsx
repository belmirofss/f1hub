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
      <View style={{ flex: 1, gap: Theme.space.xs }}>
        <HomeNextRace />
        <HomeLastRace />
        <HomeStandings />
        <BuyMeACoffe />
      </View>
    </ScreenContainer>
  );
};
