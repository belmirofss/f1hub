import { ListItemResult } from "../../components/ListItemResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useRaceResults } from "../../hooks/useRaceResult";

type Props = {
  season: string;
  round: string;
};

export const RaceResultResults = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useRaceResults({ season, round });

  const results = data?.MRData.RaceTable.Races[0].Results;

  if (!isLoading && !results?.length) {
    return null;
  }

  return (
    <SectionContainer
      name="Results"
      expansable
      isLoading={isLoading}
      isError={isError}
    >
      {results?.map((result) => (
        <ListItemResult key={result.position} result={result} />
      ))}
    </SectionContainer>
  );
};
