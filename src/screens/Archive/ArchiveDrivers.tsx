import { View } from "react-native";
import { Error } from "../../components/Error";
import { ListItemDriver } from "../../components/ListItemDriver";
import { Loading } from "../../components/Loading";
import { useSeasonDriverStandings } from "../../hooks/useSeasonDriverStandings";
import { UseSeeAllSeeLess } from "../../hooks/useSeeAllSeeLess";

type Props = {
  season: string;
};

export const ArchiveDrivers = ({ season }: Props) => {
  const { seeAll, SeeAllSeeLessButton } = UseSeeAllSeeLess();
  const { data, isLoading, isError } = useSeasonDriverStandings({ season });

  const standingList =
    data?.MRData.StandingsTable.StandingsLists[0].DriverStandings || [];
  const results = seeAll ? standingList : standingList.slice(0, 10);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return (
    <View>
      {results.map((driver) => (
        <ListItemDriver
          key={driver.Driver.driverId}
          position={driver.position}
          points={driver.points}
          driver={driver.Driver}
          constructorName={driver.Constructors.map(
            (constructor) => constructor.name
          ).join(" - ")}
        />
      ))}
      <SeeAllSeeLessButton />
    </View>
  );
};
