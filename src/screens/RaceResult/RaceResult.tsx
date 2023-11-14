import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RaceResultContentInfo } from "./RaceResultContentInfo";
import { RaceResultContentResults } from "./RaceResultContentResults";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";

type ParamList = {
  RaceResult: {
    season: string;
    round: string;
    raceName: string;
  };
};

export const RaceResult = () => {
  const route = useRoute<RouteProp<ParamList, "RaceResult">>();
  const { season, round, raceName } = route.params;

  return (
    <ScreenContainer title="RACE RESULT" showBack showMenu={false}>
      <Text
        variant="titleLarge"
        style={{
          color: Theme.colors.secondary,
          fontFamily: Theme.fonts.special,
        }}
      >
        {raceName}
      </Text>

      <RaceResultContentInfo season={season} round={round} />
      <RaceResultContentResults season={season} round={round} />
    </ScreenContainer>
  );
};
