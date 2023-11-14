import { useRoute, RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RaceResultInfo } from "./RaceResultInfo";
import { RaceResultResults } from "./RaceResultResults";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { RaceResultSprint } from "./RaceResultSprint";
import { RaceQualifyingResults } from "./RaceQualifying";

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

      <View
        style={{
          marginTop: Theme.space.xs,
        }}
      >
        <RaceResultInfo season={season} round={round} />
        <RaceResultResults season={season} round={round} />
        <RaceResultSprint season={season} round={round} />
        <RaceQualifyingResults season={season} round={round} />
      </View>
    </ScreenContainer>
  );
};
