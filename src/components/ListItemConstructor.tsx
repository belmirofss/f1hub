import { View } from "react-native";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByNationality } from "../helpers/countries";
import { ListItem } from "./ListItem";
import { Theme } from "../theme";

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
    <ListItem onClick={() => {}}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: Theme.space.xs,
        }}
      >
        <View style={{ flexDirection: "row", gap: Theme.space.xs }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ListItemCounter value={position} />
            <FlagIcon url={buildCountryFlagUrlByNationality(nationality)} />
          </View>

          <ListItemTitle>{constructorName}</ListItemTitle>
        </View>

        <ListItemPts points={points} />
      </View>
    </ListItem>
  );
};
