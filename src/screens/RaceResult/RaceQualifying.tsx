import { Text } from "react-native-paper";
import { ListItemQualifying } from "../../components/ListItemQualifying";
import { SectionContainer } from "../../components/SectionContainer";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";
import { Theme } from "../../theme";

type Props = {
  season: string;
  round: string;
};

export const RaceQualifyingResults = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useQualifyingResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.QualifyingResults;

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

      {!results?.length && (
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
