import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { FlagIcon } from "./FlagIcon";
import { buildCountryFlagUrlByNationality } from "../helpers/countries";
import { View } from "react-native";
import { ListItem } from "./ListItem";
import { Theme } from "../theme";

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

          <View>
            <ListItemTitle>
              {givenName} {familyName}
            </ListItemTitle>
            <ListItemDescription>{constructorName}</ListItemDescription>
          </View>
        </View>

        <ListItemPts points={points} />
      </View>
    </ListItem>
  );
};
