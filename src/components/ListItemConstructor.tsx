import { View } from "react-native";
import { List } from "react-native-paper";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByNationality } from "../helpers/countries";

export type Props = {
  position: string;
  points: string;
  constructorName: string;
  nationality: string;
};

export const ListItemConstructor = ({
  position,
  points,
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
      title={() => <ListItemTitle>{constructorName}</ListItemTitle>}
    />
  );
};
