import { ListItemConstructor } from "../../components/ListItemConstructor";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

export const StandingsContructors = () => {
  const { data, isLoading, isError } = useCurrentConstructorStandings();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
    (constructor) => (
      <ListItemConstructor
        key={constructor.Constructor.constructorId}
        position={constructor.position}
        points={constructor.points}
        konstructor={constructor.Constructor}
      />
    )
  );
};
