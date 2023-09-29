import { List } from "react-native-paper";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";
import { ListItemDescription } from "./ListItemDescription";

export type Props = {
  position: string;
  points: string;
  givenName: string;
  familyName: string;
  constructorName: string;
};

export const ListItemDriver = ({
  position,
  points,
  givenName,
  familyName,
  constructorName,
}: Props) => {
  return (
    <List.Item
      left={() => <ListItemCounter value={position} />}
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
