import { ListItemResult } from "../../components/ListItemResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useRaceResults } from "../../hooks/useRaceResult";
import { UseSeeAllSeeLess } from "../../hooks/useSeeAllSeeLess";

type Props = {
  season: string;
  round: string;
};

export const RaceResultResults = ({ season, round }: Props) => {
  const { seeAll, SeeAllSeeLessButton } = UseSeeAllSeeLess();
  const { data, isLoading, isError } = useRaceResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = seeAll ? race?.Results : race?.Results?.slice(0, 10);

  if (!isLoading && !isError && !results?.length) {
    return null;
  }

  return (
    <SectionContainer name="Results" isLoading={isLoading} isError={isError}>
      {results?.map((result) => (
        <ListItemResult key={result.position} result={result} />
      ))}

      <SeeAllSeeLessButton />
    </SectionContainer>
  );
};
