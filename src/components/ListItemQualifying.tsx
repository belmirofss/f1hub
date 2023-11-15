import { ListItemCounter } from "./ListItemCounter";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";
import { FlagIcon } from "./FlagIcon";
import { View } from "react-native";
import { ListItem } from "./ListItem";
import { Theme } from "../theme";
import { ListItemTime } from "./ListItemTime";
import { QualifyingResult } from "../types";

export type Props = {
  result: QualifyingResult;
};

export const ListItemQualifying = ({ result }: Props) => {
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
            <ListItemCounter value={result.position} />
            <FlagIcon nationality={result.Driver.nationality} />
          </View>

          <View>
            <ListItemTitle>
              {result.Driver.givenName} {result.Driver.familyName}
            </ListItemTitle>
            <ListItemDescription>{result.Constructor.name}</ListItemDescription>
          </View>
        </View>

        <ListItemTime time={result.Q3 || result.Q2 || result.Q1 || "NO TIME"} />
      </View>
    </ListItem>
  );
};
