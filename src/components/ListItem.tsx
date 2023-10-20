import { ReactNode } from "react";
import { TouchableRipple } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  onClick: () => void;
  children: ReactNode;
};

export const ListItem = ({ children, onClick }: Props) => {
  return (
    <TouchableRipple
      onPress={onClick}
      rippleColor={Theme.colors.darken}
      style={{
        marginVertical: Theme.space.xs,
        padding: 3,
        marginHorizontal: -6,
      }}
    >
      {children}
    </TouchableRipple>
  );
};
