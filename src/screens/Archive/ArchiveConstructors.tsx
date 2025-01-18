import { View } from "react-native";
import { Error } from "../../components/Error";
import { ListItemConstructor } from "../../components/ListItemConstructor";
import { Loading } from "../../components/Loading";
import { useSeasonConstructorStandings } from "../../hooks/useSeasonConstructorStandings";
import { UseSeeAllSeeLess } from "../../hooks/useSeeAllSeeLess";

type Props = {
  season: string;
};

export const ArchiveConstructors = ({ season }: Props) => {
  const { seeAll, SeeAllSeeLessButton } = UseSeeAllSeeLess();
  const { data, isLoading, isError } = useSeasonConstructorStandings({
    season,
  });

  const standingList =
    data?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  const shouldHaveSeeAllSeeLessButton = standingList.length > 0;
  const results =
    seeAll && shouldHaveSeeAllSeeLessButton
      ? standingList
      : standingList.slice(0, 10);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return (
    <View>
      {results.map((constructor) => (
        <ListItemConstructor
          key={constructor.Constructor.constructorId}
          position={constructor.position}
          points={constructor.points}
          konstructor={constructor.Constructor}
        />
      ))}

      {shouldHaveSeeAllSeeLessButton && <SeeAllSeeLessButton />}
    </View>
  );
};
