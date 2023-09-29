import { ListItemDriver } from "../../components/ListItemDriver";
import { DriverStanding } from "../../types";

type Props = {
  driverStandings: DriverStanding[];
};

export const StandingsDrivers = ({ driverStandings }: Props) => {
  return driverStandings.map((driver) => (
    <ListItemDriver
      key={driver.Driver.driverId}
      position={driver.position}
      points={driver.points}
      givenName={driver.Driver.givenName}
      familyName={driver.Driver.familyName}
      constructorName={driver.Constructors.map(
        (constructor) => constructor.name
      ).join(" - ")}
    />
  ));
};
