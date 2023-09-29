import { ReactNode } from "react";
import { Text } from "react-native-paper";
import { Theme } from "../theme";

type Props = {
  children: ReactNode;
};

export const ListItemDescription = ({ children }: Props) => {
  return (
    <Text
      variant="bodyLarge"
      style={{
        color: Theme.colors.primary,
      }}
    >
      {children}
    </Text>
  );
};
