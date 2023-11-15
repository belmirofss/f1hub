import { useRoute, RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RaceResultInfo } from "./RaceResultInfo";
import { RaceResultResults } from "./RaceResultResults";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { RaceResultSprint } from "./RaceResultSprint";
import { RaceQualifyingResults } from "./RaceQualifying";
import { useRaceSchedule } from "../../hooks/useRaceSchedule";

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

  const { data, isLoading, isError } = useRaceSchedule({ season, round });

  const race = data?.MRData.RaceTable.Races[0];

  return (
    <ScreenContainer
      title="RACE RESULT"
      showBack
      showMenu={false}
      isLoading={isLoading}
      isError={isError}
    >
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
      </View>

      <View
        style={{
          marginTop: Theme.space.xs,
        }}
      >
        <RaceResultResults season={season} round={round} />
      </View>

      <View
        style={{
          marginTop: Theme.space.xs,
        }}
      >
        {race?.Sprint && <RaceResultSprint season={season} round={round} />}
      </View>

      <View
        style={{
          marginTop: Theme.space.xs,
        }}
      >
        <RaceQualifyingResults season={season} round={round} />
      </View>
    </ScreenContainer>
  );
};
