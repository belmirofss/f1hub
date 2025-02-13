import { ScreenContainer } from "../../components/ScreenContainer";
import { useCurrentRaceSchedule } from "../../hooks/useCurrentRaceSchedule";
import { ListItemRace } from "../../components/ListItemRace";
import { SectionTitle } from "../../components/SectionTitle";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_CALENDAR_ID } from "../../constants";

export const Calendar = () => {
  const { data, isLoading, isError } = useCurrentRaceSchedule();
  const races = data?.MRData.RaceTable.Races;

  return (
    <ScreenContainer title="Calendar" isLoading={isLoading} isError={isError}>
      {!!races?.length &&
        races.map((race) => <ListItemRace key={race.round} race={race} />)}
      {!races?.length && <SectionTitle>NO CALENDAR YET</SectionTitle>}
      <AdBanner adUnitId={AD_BANNER_CALENDAR_ID} />
    </ScreenContainer>
  );
};
