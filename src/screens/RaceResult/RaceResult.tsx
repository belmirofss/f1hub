import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RaceResultInfo } from "./RaceResultInfo";
import { RaceResultResults } from "./RaceResultResults";
import { RaceResultSprint } from "./RaceResultSprint";
import { RaceQualifyingResults } from "./RaceQualifying";
import { useRaceSchedule } from "../../hooks/useRaceSchedule";
import { View } from "react-native";
import { Theme } from "../../theme";

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
      <View style={{ paddingBottom: Theme.space.l }}>
        <RaceResultInfo season={season} round={round} raceName={raceName} />
        <RaceResultResults season={season} round={round} />
        {race?.Sprint && <RaceResultSprint season={season} round={round} />}
        <RaceQualifyingResults season={season} round={round} />
      </View>
    </ScreenContainer>
  );
};
