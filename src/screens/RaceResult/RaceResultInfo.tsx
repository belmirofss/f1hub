import { useMemo } from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import { InfoItem } from "../../components/InfoItem";
import { formatDate } from "../../helpers/formatDate";
import { useRaceResults } from "../../hooks/useRaceResult";
import { SectionContainer } from "../../components/SectionContainer";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";
import { useSprintResults } from "../../hooks/useSprintResults";

type Props = {
  season: string;
  round: string;
};

export const RaceResultInfo = ({ season, round }: Props) => {
  const {
    data: raceResultsData,
    isLoading: isLoadingRaceResults,
    isError: isErrorRaceResults,
  } = useRaceResults({ season, round });

  const {
    data: qualifyingResultsData,
    isLoading: isLoadingQualifyingResults,
    isError: isErrorQualifyingResults,
  } = useQualifyingResults({ season, round });

  const {
    data: sprintResultsData,
    isLoading: isLoadingSprintResults,
    isError: isErrorSprintResults,
  } = useSprintResults({ season, round });

  const race = raceResultsData?.MRData.RaceTable.Races[0];
  const results = race?.Results || [];
  const winner = results[0] ? results[0].Driver : null;
  const second = results[1] ? results[1].Driver : null;
  const third = results[2] ? results[2].Driver : null;
  const fastestLap = useMemo(() => {
    const result = results.filter((r) => r.FastestLap?.rank === "1");

    if (result.length === 1) {
      return result[0];
    }
  }, [results]);

  const sprint = sprintResultsData?.MRData.RaceTable.Races[0];
  const sprintResults = sprint?.SprintResults || [];
  const sprintWinner = sprintResults[0] ? sprintResults[0].Driver : null;

  const qualifying = qualifyingResultsData?.MRData.RaceTable.Races[0];
  const qualifyingResults = qualifying?.QualifyingResults || [];
  const pole = qualifyingResults[0] ? qualifyingResults[0].Driver : null;

  return (
    <SectionContainer
      name="Info"
      expansable
      isLoading={
        isLoadingRaceResults ||
        isLoadingSprintResults ||
        isLoadingQualifyingResults
      }
      isError={
        isErrorRaceResults || isErrorSprintResults || isErrorQualifyingResults
      }
    >
      {race && (
        <View
          style={{
            marginTop: Theme.space.xs,
          }}
        >
          <InfoItem
            title="Season / Round"
            value={`${race.season} / ${race.round}`}
          />
          <InfoItem title="Date" value={formatDate(race.date, race.time)} />
          <InfoItem title="Country" value={race.Circuit.Location.country} />
          <InfoItem title="Locality" value={race.Circuit.Location.locality} />
          <InfoItem title="Circuit" value={race.Circuit.circuitName} />
          {!!winner && (
            <InfoItem
              title="Winner"
              value={`${winner.givenName} ${winner.familyName}`}
            />
          )}
          {!!second && (
            <InfoItem
              title="Second"
              value={`${second.givenName} ${second.familyName}`}
            />
          )}
          {!!third && (
            <InfoItem
              title="Third"
              value={`${third.givenName} ${third.familyName}`}
            />
          )}
          {!!fastestLap && (
            <InfoItem
              title="Fastest lap"
              value={`${fastestLap.Driver.givenName} ${fastestLap.Driver.familyName} / ${fastestLap.FastestLap.Time.time}`}
            />
          )}
          {!!sprintWinner && (
            <InfoItem
              title="Sprint winner"
              value={`${sprintWinner.givenName} ${sprintWinner.familyName}`}
            />
          )}
          {!!pole && (
            <InfoItem
              title="Pole position"
              value={`${pole.givenName} ${pole.familyName}`}
            />
          )}
        </View>
      )}
    </SectionContainer>
  );
};
