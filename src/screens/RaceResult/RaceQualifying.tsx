import { ListItemQualifying } from "../../components/ListItemQualifying";
import { SectionContainer } from "../../components/SectionContainer";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";

type Props = {
  season: string;
  round: string;
};

export const RaceQualifyingResults = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useQualifyingResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.QualifyingResults;

  if (!isLoading && !isError && !results?.length) {
    return null;
  }

  return (
    <SectionContainer
      name="Qualifying"
      expansable
      isLoading={isLoading}
      isError={isError}
      startClosed
    >
      {results?.map((result) => (
        <ListItemQualifying key={result.position} result={result} />
      ))}
    </SectionContainer>
  );
};
