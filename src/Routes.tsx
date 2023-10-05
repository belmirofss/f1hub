import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Theme } from "./theme";
import { Calendar } from "./screens/Calendar/Calendar";
import { TabIconContainer } from "./components/TabIconContainer";
import { Standings } from "./screens/Standings/Standings";
import { Home } from "./screens/Home/Home";
import { Archive } from "./screens/Archive/Archive";

const ICON_SIZE = 24;

const StackNavigator = createStackNavigator();
const Tab = createBottomTabNavigator();

const ButtomHomeNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Home" component={Home} />
    </StackNavigator.Navigator>
  );
};

const ButtomCalendarNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Calendar" component={Calendar} />
    </StackNavigator.Navigator>
  );
};

const ButtomStandingsNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Standings" component={Standings} />
    </StackNavigator.Navigator>
  );
};

const ArchiveStandingsNavigator = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Archive" component={Archive} />
    </StackNavigator.Navigator>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.secondary,
        tabBarInactiveTintColor: Theme.colors.darken,
        tabBarStyle: {
          backgroundColor: Theme.colors.darken,
          height: 56,
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
        name="ButtomHomeNavigator"
        component={ButtomHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconContainer backgroundColor={color}>
              <MaterialCommunityIcons
                name="home"
                size={ICON_SIZE}
                color={Theme.colors.primary}
              />
            </TabIconContainer>
          ),
        }}
      />
      <Tab.Screen
        name="ButtomCalendarNavigator"
        component={ButtomCalendarNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconContainer backgroundColor={color}>
              <MaterialCommunityIcons
                name="calendar"
                size={ICON_SIZE}
                color={Theme.colors.primary}
              />
            </TabIconContainer>
          ),
        }}
      />
      <Tab.Screen
        name="ButtomStandingsNavigator"
        component={ButtomStandingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconContainer backgroundColor={color}>
              <MaterialIcons
                name="leaderboard"
                size={ICON_SIZE}
                color={Theme.colors.primary}
              />
            </TabIconContainer>
          ),
        }}
      />
      <Tab.Screen
        name="ArchiveStandingsNavigator"
        component={ArchiveStandingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconContainer backgroundColor={color}>
              <MaterialIcons
                name="folder"
                size={ICON_SIZE}
                color={Theme.colors.primary}
              />
            </TabIconContainer>
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
