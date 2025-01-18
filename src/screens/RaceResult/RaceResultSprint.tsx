import { Text } from "react-native-paper";
import { ListItemResult } from "../../components/ListItemResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useSprintResults } from "../../hooks/useSprintResults";
import { Theme } from "../../theme";
import { UseSeeAllSeeLess } from "../../hooks/useSeeAllSeeLess";

type Props = {
  season: string;
  round: string;
};

export const RaceResultSprint = ({ season, round }: Props) => {
  const { seeAll, SeeAllSeeLessButton } = UseSeeAllSeeLess();
  const { data, isLoading, isError } = useSprintResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = seeAll
    ? race?.SprintResults
    : race?.SprintResults?.slice(0, 10);

  return (
    <SectionContainer name="Sprint" isLoading={isLoading} isError={isError}>
      {results?.map((result) => (
        <ListItemResult key={result.position} result={result} />
      ))}

      {results?.length ? (
        <SeeAllSeeLessButton />
      ) : (
        <Text
          style={{
            fontFamily: Theme.fonts.special,
            color: Theme.colors.primary,
            marginTop: Theme.space.xs,
          }}
        >
          No sprint race
        </Text>
      )}
    </SectionContainer>
  );
};
