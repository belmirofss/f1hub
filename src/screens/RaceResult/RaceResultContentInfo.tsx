import { View } from "react-native";
import { Theme } from "../../theme";
import { InfoItem } from "../../components/InfoItem";
import { Race } from "../../types";
import { formatDate } from "../../helpers/formatDate";

type Props = {
  race: Race;
};

export const RaceResultContentInfo = ({ race }: Props) => {
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
      <InfoItem title="Date" value={formatDate(race.date, race.time)} />
      <InfoItem title="Country" value={race.Circuit.Location.country} />
      <InfoItem title="Locality" value={race.Circuit.Location.locality} />
      <InfoItem title="Circuit" value={race.Circuit.circuitName} />
      {!!race.Results?.length && (
        <InfoItem
          title="Winner"
          value={`${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName}`}
        />
      )}
    </View>
  );
};
