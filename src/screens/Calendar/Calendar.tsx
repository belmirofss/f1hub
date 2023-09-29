import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { CalendarRaceItem } from "./CalendarRaceItem";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

export const Calendar = () => {
  const { data, isLoading, isError } = useCurrentRaceSchedule();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return (
    <ScreenContainer title={`Season ${data.MRData.RaceTable.season} calendar`}>
      {data.MRData.RaceTable.Races.map((race) => (
        <CalendarRaceItem race={race} key={race.raceName} />
      ))}
    </ScreenContainer>
  );
};
