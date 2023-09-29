import { List } from "react-native-paper";
import { ListItemCounter } from "./ListItemCounter";
import { ListItemPts } from "./ListItemPts";
import { ListItemTitle } from "./ListItemTitle";

export type Props = {
  position: string;
  points: string;
  constructorName: string;
};

export const ListItemConstructor = ({
  position,
  points,
  constructorName,
}: Props) => {
  return (
    <List.Item
      left={() => <ListItemCounter value={position} />}
      right={() => <ListItemPts points={points} />}
      title={() => <ListItemTitle>{constructorName}</ListItemTitle>}
    />
  );
};
