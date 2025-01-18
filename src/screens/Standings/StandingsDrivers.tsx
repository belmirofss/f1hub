import { Text } from "react-native-paper";
import { Error } from "../../components/Error";
import { ListItemDriver } from "../../components/ListItemDriver";
import { Loading } from "../../components/Loading";
import { useCurrentDriverStandings } from "../../hooks/useCurrentDriverStandings";
import { Theme } from "../../theme";
import { View } from "react-native";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_STANDINGS_DRIVERS_ID } from "../../constants";

export const StandingsDrivers = () => {
  const { data, isLoading, isError } = useCurrentDriverStandings();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const driverStandings =
    data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;

  return (
    <View>
      {driverStandings ? (
        driverStandings.map((driver) => (
          <ListItemDriver
            key={driver.Driver.driverId}
            position={driver.position}
            points={driver.points}
            driver={driver.Driver}
            constructorName={driver.Constructors.map(
              (constructor) => constructor.name
            ).join(" - ")}
          />
        ))
      ) : (
        <Text
          style={{
            fontFamily: Theme.fonts.special,
            color: Theme.colors.primary,
            textAlign: "center",
          }}
          variant="titleMedium"
        >
          The season has not started yet
        </Text>
      )}

      <AdBanner adUnitId={AD_BANNER_STANDINGS_DRIVERS_ID} />
    </View>
  );
};
