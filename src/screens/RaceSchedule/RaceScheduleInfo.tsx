import { View } from "react-native";
import { Theme } from "../../theme";
import { InfoItem } from "../../components/InfoItem";
import { formatDate } from "../../helpers/formatDate";
import { SectionContainer } from "../../components/SectionContainer";
import { useRaceSchedule } from "../../hooks/useRaceSchedule";
import { Text } from "react-native-paper";

type Props = {
  season: string;
  round: string;
  raceName: string;
};

export const RaceScheduleInfo = ({ season, round, raceName }: Props) => {
  const { data, isLoading, isError } = useRaceSchedule({ season, round });

  const race = data?.MRData.RaceTable.Races[0];

  return (
    <SectionContainer name="Info" isLoading={isLoading} isError={isError}>
      {race && (
        <View>
          <Text
            variant="titleMedium"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.special,
              marginTop: Theme.space.s,
              textAlign: "center",
            }}
          >
            {raceName}
          </Text>
          <InfoItem
            title="Season / Round"
            value={`${race.season} / ${race.round}`}
          />
          <InfoItem title="Date" value={formatDate(race.date, race.time)} />
          {race.Sprint && (
            <InfoItem
              title="Sprint"
              value={formatDate(race.Sprint.date, race.Sprint.time)}
            />
          )}
          {race.Qualifying && (
            <InfoItem
              title="Qualifying"
              value={formatDate(race.Qualifying.date, race.Qualifying.time)}
            />
          )}
          {!race.Sprint && race.SecondPractice && (
            <InfoItem
              title="Practice 2"
              value={formatDate(
                race.SecondPractice.date,
                race.SecondPractice.time
              )}
            />
          )}
          {race.FirstPractice && (
            <InfoItem
              title="Practice 1"
              value={formatDate(
                race.FirstPractice.date,
                race.FirstPractice.time
              )}
            />
          )}
          <InfoItem title="Country" value={race.Circuit.Location.country} />
          <InfoItem title="Locality" value={race.Circuit.Location.locality} />
          <InfoItem title="Circuit" value={race.Circuit.circuitName} />
        </View>
      )}
    </SectionContainer>
  );
};
