import { useMemo } from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import { InfoItem } from "../../components/InfoItem";
import { formatDate } from "../../helpers/formatDate";
import { useRaceResults } from "../../hooks/useRaceResult";
import { SectionContainer } from "../../components/SectionContainer";

type Props = {
  season: string;
  round: string;
};

export const RaceResultInfo = ({ season, round }: Props) => {
  const { data, isLoading, isError } = useRaceResults({ season, round });

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.Results || [];
  const winner = results[0] ? results[0].Driver : null;
  const fastestLap = useMemo(() => {
    const result = results.filter((r) => r.FastestLap?.rank === "1");

    if (result.length === 1) {
      return result[0];
    }
  }, [results]);

  return (
    <SectionContainer
      name="Info"
      expansable
      isLoading={isLoading}
      isError={isError}
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
          {!!fastestLap && (
            <InfoItem
              title="Fastest lap"
              value={`${fastestLap.Driver.givenName} ${fastestLap.Driver.familyName} / ${fastestLap.FastestLap.Time.time}`}
            />
          )}
        </View>
      )}
    </SectionContainer>
  );
};
