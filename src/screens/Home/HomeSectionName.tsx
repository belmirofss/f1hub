import { ReactNode } from "react";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";

type Props = {
  children: ReactNode;
};

export const HomeSectionName = ({ children }: Props) => {
  return (
    <Text
      variant="titleMedium"
      style={{
        fontFamily: Theme.fonts.special,
        color: Theme.colors.secondary,
      }}
    >
      {children}
    </Text>
  );
};
