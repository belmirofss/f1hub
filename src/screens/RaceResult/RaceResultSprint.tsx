import { ListItemResult } from "../../components/ListItemResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useSprintResults } from "../../hooks/useSprintResults";

type Props = {
  season: string;
  round: string;
};

export const RaceResultSprint = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useSprintResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.SprintResults;

  if (!isLoading && !isError && !results?.length) {
    return null;
  }

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
    </SectionContainer>
  );
};
