import { View } from "react-native";
import { Theme } from "../../theme";
import { InfoItem } from "../../components/InfoItem";
import { Race } from "../../types";
import { useTimezone } from "../../hooks/useTimezone";
import moment from "moment";

type Props = {
  race: Race;
};

export const RaceResultContentInfo = ({ race }: Props) => {
  const timezone = useTimezone();

  return (
    <View
      style={{
        marginTop: Theme.space.xs,
      }}
    >
      <InfoItem
        title="Season / Round"
        value={`${race.season} / ${race.round}`}
      />
      <InfoItem
        title="Date"
        value={moment(`${race.date} ${race.time}`)
          .tz(timezone)
          .format("MMM DD[,] HH:mm")}
      />
      <InfoItem title="Country" value={race.Circuit.Location.country} />
      <InfoItem title="Locality" value={race.Circuit.Location.locality} />
      <InfoItem title="Circuit" value={race.Circuit.circuitName} />
    </View>
  );
};
