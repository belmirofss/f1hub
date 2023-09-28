import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { DriverStanding } from "../../types";
import { Theme } from "../../theme";

type Props = {
  driverStandings: DriverStanding[];
};

export const DriverStandings = ({ driverStandings }: Props) => {
  return driverStandings.map((driver) => (
    <List.Item
      key={driver.Driver.driverId}
      left={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: Theme.colors.light,
              fontFamily: Theme.fonts.bold,
            }}
          >
            {driver.position.padStart(2, "0")}.
          </Text>
        </View>
      )}
      right={() => (
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            variant="labelMedium"
            style={{
              color: Theme.colors.secondary,
              fontFamily: Theme.fonts.bold,
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
            fontFamily: Theme.fonts.regular,
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
