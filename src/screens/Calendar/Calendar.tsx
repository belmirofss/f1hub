import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { ListItemRace } from "../../components/ListItemRace";

export const Calendar = () => {
  const { data, isLoading, isError } = useCurrentRaceSchedule();

  return (
    <ScreenContainer title="Calendar" isLoading={isLoading} isError={isError}>
      {data?.MRData.RaceTable.Races.map((race) => (
        <ListItemRace key={race.round} race={race} />
      ))}
    </ScreenContainer>
  );
};
