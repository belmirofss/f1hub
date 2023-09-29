import { View } from "react-native";
import { Text } from "react-native-paper";
import { Race, Result } from "../../types";
import { HomeSection } from "./HomeSection";
import moment from "moment-timezone";
import { Theme } from "../../theme";
import { useTimezone } from "../../hooks/useTimezone";
import { ListItemDriver } from "../../components/ListItemDriver";

type Props = {
  race: Race;
  results: Result[];
};

export const HomeLastRace = ({ race, results }: Props) => {
  const timezone = useTimezone();

  return (
    <HomeSection
      name="LAST RACE"
      title={race.raceName}
      description={race.Circuit.circuitName}
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
          />
        ))}
      </View>
    </HomeSection>
  );
};
