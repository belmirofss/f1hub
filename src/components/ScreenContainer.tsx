import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Theme } from "../theme";
import { IconButton, Text } from "react-native-paper";
import { useNavigation, DrawerActions } from "@react-navigation/native";

type Props = {
  title: string;
  children: ReactNode;
  showMenu?: boolean;
  showBack?: boolean;
};

export const ScreenContainer = ({
  title,
  children,
  showMenu = true,
  showBack,
}: Props) => {
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
            justifyContent:
              showMenu || showBack ? "space-between" : "flex-start",
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
          {showMenu && (
            <IconButton
              icon="menu"
              iconColor={Theme.colors.primary}
              size={30}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{
                marginRight: -Theme.space.xs, // removes extra right padding
              }}
            />
          )}

          {showBack && (
            <IconButton
              icon="arrow-left"
              iconColor={Theme.colors.primary}
              size={30}
              onPress={navigation.goBack}
              style={{
                marginRight: -Theme.space.xs, // removes extra right padding
              }}
            />
          )}
        </View>
        {children}
      </View>
    </ScrollView>
  );
};
