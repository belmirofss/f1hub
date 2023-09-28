import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Theme } from "../theme";
import { Text } from "react-native-paper";

type Props = {
  title: string;
  children: ReactNode;
};

export const ScreenContainer = ({ title, children }: Props) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: Theme.colors.dark,
          padding: Theme.space.s,
        }}
      >
        <Text
          variant="titleLarge"
          style={{
            color: Theme.colors.primary,
            fontFamily: Theme.fonts.special,
            marginBottom: Theme.space.xs,
          }}
        >
          {title}
        </Text>
        {children}
      </View>
    </ScrollView>
  );
};
