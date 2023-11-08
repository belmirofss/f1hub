import { Error } from "../../components/Error";
import { ListItemConstructor } from "../../components/ListItemConstructor";
import { Loading } from "../../components/Loading";
import { useSeasonConstructorStandings } from "../../hooks/useSeasonConstructorStandings";

type Props = {
  season: string;
};

export const ArchiveConstructors = ({ season }: Props) => {
  const { data, isLoading, isError } = useSeasonConstructorStandings({
    season,
  });

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
