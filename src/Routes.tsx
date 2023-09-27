import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "./theme";
import { Calendar } from "./screens/Calendar/Calendar";

const ICON_SIZE = 28;

const StackNavigator = createStackNavigator();
const Tab = createBottomTabNavigator();

const ButtomCalendarNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Calendar" component={Calendar} />
    </StackNavigator.Navigator>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.secondary,
        tabBarInactiveTintColor: Theme.colors.primary,
        tabBarStyle: {
          height: 64,
          borderTopWidth: 0,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
        },
        tabBarIconStyle: {
          padding: 0,
          margin: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: Theme.colors.darken,
      }}
    >
      <Tab.Screen
        name="ButtomCalendarNavigator"
        component={ButtomCalendarNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: color,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <MaterialCommunityIcons
                name="road"
                size={ICON_SIZE}
                color={Theme.colors.primary}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const Routes = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Screen
        name="BottomNavigator"
        component={BottomNavigator}
      />
    </StackNavigator.Navigator>
  );
};
