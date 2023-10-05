import { Error } from "../../components/Error";
import { ListItemRace } from "../../components/ListItemRace";
import { Loading } from "../../components/Loading";
import { useSeasonRaceSchedule } from "../../hooks/useSeasonRaceSchedule";

type Props = {
  season: string;
};

export const ArchiveCalendar = ({ season }: Props) => {
  const { data, isLoading, isError } = useSeasonRaceSchedule({
    season,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return data.MRData.RaceTable.Races.map((race) => (
    <ListItemRace
      key={race.round}
      round={race.round}
      country={race.Circuit.Location.country}
      date={race.date}
      time={race.time}
      raceName={race.raceName}
      circuitName={race.Circuit.circuitName}
    />
  ));
};
