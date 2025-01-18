import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ScreenContainer";
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
      <RaceScheduleInfo season={season} round={round} raceName={raceName} />
    </ScreenContainer>
  );
};
