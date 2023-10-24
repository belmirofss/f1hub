import { View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useRaceResults } from "../../hooks/useRaceResult";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { RaceResultContent } from "./RaceResultContent";

type ParamList = {
  RaceResult: {
    season: string;
    round: string;
  };
};

export const RaceResult = () => {
  const route = useRoute<RouteProp<ParamList, "RaceResult">>();
  const { season, round } = route.params;
  const { data, isLoading, isError } = useRaceResults({ season, round });

  return (
    <ScreenContainer title="RACE RESULT" showBack showMenu={false}>
      {isLoading ? (
        <Loading />
      ) : isError || !data ? (
        <Error />
      ) : (
        <RaceResultContent race={data.MRData.RaceTable.Races[0]} />
      )}
    </ScreenContainer>
  );
};
