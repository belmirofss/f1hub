import { ReactNode } from "react";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  children: ReactNode;
};

export const ScreenTitle = ({ children }: Props) => {
  return (
    <Text variant="titleSmall" style={{ color: Theme.colors.accent }}>
      {children}
    </Text>
  );
};
