import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { CalendarRaceItem } from "./CalendarRaceItem";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

export const Calendar = () => {
  const { data, isLoading, isError } = useCurrentRaceSchedule();

  return (
    <ScreenContainer title="Calendar">
      {isLoading ? (
        <Loading />
      ) : isError || !data ? (
        <Error />
      ) : (
        data.MRData.RaceTable.Races.map((race) => (
          <CalendarRaceItem key={race.round} race={race} />
        ))
      )}
    </ScreenContainer>
  );
};
