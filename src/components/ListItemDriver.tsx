import { List } from "react-native-paper";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByNationality } from "../helpers/countries";
import { View } from "react-native";

export type Props = {
  position: string;
  points: string;
  givenName: string;
  familyName: string;
  constructorName: string;
  nationality: string;
};

export const ListItemDriver = ({
  position,
  points,
  givenName,
  familyName,
  constructorName,
  nationality,
}: Props) => {
  return (
    <List.Item
      left={() => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ListItemCounter value={position} />
          <FlagIcon url={buildCountryFlagUrlByNationality(nationality)} />
        </View>
      )}
      right={() => <ListItemPts points={points} />}
      title={() => (
        <ListItemTitle>
          {givenName} {familyName}
        </ListItemTitle>
      )}
      description={() => (
        <ListItemDescription>{constructorName}</ListItemDescription>
      )}
    />
  );
};
