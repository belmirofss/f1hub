import { View } from "react-native";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { FlagIcon } from "./FlagIcon";
import { ListItem } from "./ListItem";
import { Theme } from "../theme";
import { Constructor } from "../types";

export type Props = {
  position: string;
  points: string;
  konstructor: Constructor;
};

export const ListItemConstructor = ({
  position,
  points,
  konstructor,
}: Props) => {
  return (
    <ListItem>
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
            <FlagIcon nationality={konstructor.nationality} />
          </View>

          <ListItemTitle>{konstructor.name}</ListItemTitle>
        </View>

        <ListItemPts points={points} />
      </View>
    </ListItem>
  );
};
