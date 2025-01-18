import { Text } from "react-native-paper";
import { ListItemQualifying } from "../../components/ListItemQualifying";
import { SectionContainer } from "../../components/SectionContainer";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";
import { Theme } from "../../theme";
import { UseSeeAllSeeLess } from "../../hooks/useSeeAllSeeLess";

type Props = {
  season: string;
  round: string;
};

export const RaceQualifyingResults = ({ season, round }: Props) => {
  const { seeAll, SeeAllSeeLessButton } = UseSeeAllSeeLess();
  const { data, isLoading, isError } = useQualifyingResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = seeAll
    ? race?.QualifyingResults
    : race?.QualifyingResults?.slice(0, 10);

  return (
    <SectionContainer name="Qualifying" isLoading={isLoading} isError={isError}>
      {results?.map((result) => (
        <ListItemQualifying key={result.position} result={result} />
      ))}

      {results?.length ? (
        <SeeAllSeeLessButton />
      ) : (
        <Text
          style={{
            fontFamily: Theme.fonts.special,
            color: Theme.colors.primary,
            marginVertical: Theme.space.xs,
          }}
        >
          No qualifying results available
        </Text>
      )}
    </SectionContainer>
  );
};
