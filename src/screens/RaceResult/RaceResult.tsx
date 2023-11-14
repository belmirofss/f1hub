import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RaceResultInfo } from "./RaceResultInfo";
import { RaceResultResults } from "./RaceResultResults";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { RaceResultSprint } from "./RaceResultSprint";

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

      <RaceResultInfo season={season} round={round} />
      <RaceResultResults season={season} round={round} />
      <RaceResultSprint season={season} round={round} />
    </ScreenContainer>
  );
};
