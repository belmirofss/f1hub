import { Error } from "../../components/Error";
import { ListItemDriver } from "../../components/ListItemDriver";
import { Loading } from "../../components/Loading";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";

export const StandingsDrivers = () => {
  const { data, isLoading, isError } = useCurrentDriverStandings();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
    (driver) => (
      <ListItemDriver
        key={driver.Driver.driverId}
        position={driver.position}
        points={driver.points}
        driver={driver.Driver}
        constructorName={driver.Constructors.map(
          (constructor) => constructor.name
        ).join(" - ")}
      />
    )
  );
};
