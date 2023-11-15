import { Text } from "react-native-paper";
import { ListItemResult } from "../../components/ListItemResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useSprintResults } from "../../hooks/useSprintResults";
import { Theme } from "../../theme";

type Props = {
  season: string;
  round: string;
};

export const RaceResultSprint = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useSprintResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.SprintResults;

  return (
    <SectionContainer
      name="Sprint"
      expansable
      isLoading={isLoading}
      isError={isError}
      startClosed
    >
      {results?.map((result) => (
        <ListItemResult key={result.position} result={result} />
      ))}

      {!results?.length && (
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
