import { ReactNode } from "react";
import { View } from "react-native";
import { Theme } from "../theme";

type Props = {
  children: ReactNode;
};

export const ScreenContainer = ({ children }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: Theme.space.s,
      }}
    >
      {children}
    </View>
  );
};
