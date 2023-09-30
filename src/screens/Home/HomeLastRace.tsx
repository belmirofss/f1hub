import { View } from "react-native";
import { Text } from "react-native-paper";
import { Race, Result } from "../../types";
import { SectionContainer } from "../../components/SectionContainer";
import moment from "moment-timezone";
import { Theme } from "../../theme";
import { useTimezone } from "../../hooks/useTimezone";
import { ListItemDriver } from "../../components/ListItemDriver";
import { FlagIcon } from "../../components/FlagIcon";
import { buildCountryFlagUrlByName } from "../../helpers/countries";

type Props = {
  race: Race;
  results: Result[];
};

export const HomeLastRace = ({ race, results }: Props) => {
  const timezone = useTimezone();

  return (
    <SectionContainer
      name="LAST RACE"
      title={race.raceName}
      description={race.Circuit.circuitName}
      right={
        <FlagIcon
          url={buildCountryFlagUrlByName(race.Circuit.Location.country)}
        />
      }
    >
      <View style={{ marginTop: Theme.space.xs }}>
        <Text
          variant="labelSmall"
          style={{ color: Theme.colors.light, fontFamily: Theme.fonts.special }}
        >
          {moment(`${race.date} ${race.time}`)
            .tz(timezone)
            .format("MMM DD[,] HH:mm")}{" "}
          - Podium
        </Text>

        {results.slice(0, 3).map((result) => (
          <ListItemDriver
            key={result.position}
            position={result.position}
            points={result.points}
            givenName={result.Driver.givenName}
            familyName={result.Driver.familyName}
            constructorName={result.Constructor.name}
            nationality={result.Driver.nationality}
          />
        ))}
      </View>
    </SectionContainer>
  );
};
