import { ReactNode } from "react";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  children: ReactNode;
};

export const ListItemTitle = ({ children }: Props) => {
  return (
    <Text
      variant="bodyLarge"
      style={{
        color: Theme.colors.primary,
        fontFamily: Theme.fonts.bold,
      }}
    >
      {children}
    </Text>
  );
};
