import { Error } from "../../components/Error";
import { ListItemDriver } from "../../components/ListItemDriver";
import { Loading } from "../../components/Loading";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";

type Props = {
  season: string;
};

export const ArchiveDrivers = ({ season }: Props) => {
  const { data, isLoading, isError } = useSeasonDriverStandings({ season });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
    (driver) => (
      <ListItemDriver
        key={driver.Driver.driverId}
        position={driver.position}
        points={driver.points}
        givenName={driver.Driver.givenName}
        familyName={driver.Driver.familyName}
        constructorName={driver.Constructors.map(
          (constructor) => constructor.name
        ).join(" - ")}
        nationality={driver.Driver.nationality}
      />
    )
  );
};
