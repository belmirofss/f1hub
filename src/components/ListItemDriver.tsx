import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { FlagIcon } from "./FlagIcon";
import { View } from "react-native";
import { ListItem } from "./ListItem";
import { Theme } from "../theme";
import { Driver } from "../types";

export type Props = {
  position: string;
  points: string;
  driver: Driver;
  constructorName: string;
};

export const ListItemDriver = ({
  position,
  points,
  driver,
  constructorName,
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
            <FlagIcon nationality={driver.nationality} />
          </View>

          <View>
            <ListItemTitle>
              {driver.givenName} {driver.familyName}
            </ListItemTitle>
            <ListItemDescription>{constructorName}</ListItemDescription>
          </View>
        </View>

        <ListItemPts points={points} />
      </View>
    </ListItem>
  );
};
