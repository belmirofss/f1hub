import { ListItemConstructor } from "../../components/ListItemConstructor";
import { useCurrentConstructorStandings } from "../../hooks/useCurrentConstructorStandings";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";

export const StandingsContructors = () => {
  const { data, isLoading, isError } = useCurrentConstructorStandings();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const constructorStandings =
    data?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings;

  if (!constructorStandings) {
    return (
      <Text
        style={{
          fontFamily: Theme.fonts.special,
          color: Theme.colors.primary,
          textAlign: "center",
        }}
        variant="titleMedium"
      >
        The season has not started yet
      </Text>
    );
  }

  return constructorStandings.map((constructor) => (
    <ListItemConstructor
      key={constructor.Constructor.constructorId}
      position={constructor.position}
      points={constructor.points}
      konstructor={constructor.Constructor}
    />
  ));
};
