import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Theme } from "../theme";
import { IconButton, Text } from "react-native-paper";
import { useNavigation, DrawerActions } from "@react-navigation/native";

type Props = {
  title: string;
  children: ReactNode;
};

export const ScreenContainer = ({ title, children }: Props) => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: Theme.colors.dark,
          padding: Theme.space.s,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              color: Theme.colors.primary,
              fontFamily: Theme.fonts.special,
            }}
          >
            {title}
          </Text>
          <IconButton
            icon="menu"
            iconColor={Theme.colors.primary}
            size={30}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        </View>
        {children}
      </View>
    </ScrollView>
  );
};
