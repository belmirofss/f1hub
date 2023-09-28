import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  backgroundColor: string;
  children: ReactNode;
};

export const TabIconContainer = ({ backgroundColor, children }: Props) => {
  return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
      }}
    >
      {children}
    </View>
  );
};
