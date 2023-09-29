import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { DriverStanding } from "../../types";
import { Theme } from "../../theme";
import { ListItemCounter } from "../../components/ListItemCounter";

type Props = {
  driverStandings: DriverStanding[];
};

export const StandingsDrivers = ({ driverStandings }: Props) => {
  return driverStandings.map((driver) => (
    <List.Item
      key={driver.Driver.driverId}
      left={() => <ListItemCounter value={driver.position} />}
      right={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="labelSmall"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {driver.points} PTS
          </Text>
        </View>
      )}
      title={
        <Text
          variant="bodyLarge"
          style={{
            color: Theme.colors.primary,
            fontFamily: Theme.fonts.bold,
          }}
        >
          {driver.Driver.givenName} {driver.Driver.familyName}
        </Text>
      }
      description={
        <Text
          variant="bodyLarge"
          style={{
            color: Theme.colors.primary,
          }}
        >
          {driver.Constructors.map((constructor) => constructor.name).join(
            " - "
          )}
        </Text>
      }
    />
  ));
};
