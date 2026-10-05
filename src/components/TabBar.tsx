import { Pressable, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { useSettings } from "../settings/SettingsContext";

const ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Home: "home-outline",
  Calendar: "calendar-blank-outline",
  Standings: "podium",
  Archive: "archive-outline",
};

export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { accent } = useSettings();

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        backgroundColor: Theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.line,
        paddingHorizontal: 4,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? accent : Theme.colors.muted;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={route.name}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 3,
              paddingTop: 8,
              borderTopWidth: 2,
              borderTopColor: focused ? accent : "transparent",
              marginTop: -1,
            }}
          >
            <MaterialCommunityIcons name={ICONS[route.name]} size={23} color={color} />
            <AppText size={11} weight={focused ? "bold" : "semibold"} color={color}>
              {route.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
