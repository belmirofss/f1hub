import { Text } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";

type ParamList = {
  RaceResult: {
    season: string;
    round: string;
  };
};

export const RaceResult = () => {
  const route = useRoute<RouteProp<ParamList, "RaceResult">>();
  const { season, round } = route.params;

  return (
    <ScreenContainer title="RACE RESULT" showBack showMenu={false}>
      <Text>Race result is working</Text>
    </ScreenContainer>
  );
};
