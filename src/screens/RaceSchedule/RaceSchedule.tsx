import { useRoute, RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { RaceScheduleInfo } from "./RaceScheduleInfo";

type ParamList = {
  RaceSchedule: {
    season: string;
    round: string;
    raceName: string;
  };
};

export const RaceSchedule = () => {
  const route = useRoute<RouteProp<ParamList, "RaceSchedule">>();
  const { season, round, raceName } = route.params;

  return (
    <ScreenContainer title="RACE SCHEDULE" showBack showMenu={false}>
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
        <RaceScheduleInfo season={season} round={round} />
      </View>
    </ScreenContainer>
  );
};
