import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Home } from "./screens/Home/Home";
import { Theme } from "./theme";

const ICON_SIZE = 28;

const StackNavigator = createStackNavigator();
const Tab = createBottomTabNavigator();

const ButtomHomeNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Home" component={Home} />
    </StackNavigator.Navigator>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.accent,
        tabBarInactiveTintColor: Theme.colors.common,
        tabBarStyle: {
          height: 48,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold",
          paddingBottom: Theme.space.xs,
          padding: 0,
          margin: 0,
          fontFamily: Theme.font,
        },
        tabBarIconStyle: {
          padding: 0,
          margin: 0,
        },
        tabBarActiveBackgroundColor: Theme.colors.background,
      }}
    >
      <Tab.Screen
        name="ButtomHomeNavigator"
        component={ButtomHomeNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={ICON_SIZE} color={color} />
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
