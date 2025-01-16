import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Theme } from "./theme";
import { Calendar } from "./screens/Calendar/Calendar";
import { TabIconContainer } from "./components/TabIconContainer";
import { Standings } from "./screens/Standings/Standings";
import { Home } from "./screens/Home/Home";
import { Archive } from "./screens/Archive/Archive";
import { About } from "./screens/About/About";
import { RaceResult } from "./screens/RaceResult/RaceResult";
import { RaceSchedule } from "./screens/RaceSchedule/RaceSchedule";

type BottomNavigatorProps = {
  initialRouteName: string;
};

const ICON_SIZE = 24;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const StackHomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const StackCalendarNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={Calendar} />
    </Stack.Navigator>
  );
};

const StackStandingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Standings" component={Standings} />
    </Stack.Navigator>
  );
};

const StackArchiveNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Archive" component={Archive} />
    </Stack.Navigator>
  );
};

const StackAboutNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};

const BottomNavigator = ({ initialRouteName }: BottomNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.secondary,
        tabBarInactiveTintColor: Theme.colors.darken,
        tabBarStyle: {
          backgroundColor: Theme.colors.darken,
          height: 100,
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
      initialRouteName={initialRouteName}
    >
      <Tab.Screen
        name="StackHomeNavigator"
        component={StackHomeNavigator}
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
        name="StackCalendarNavigator"
        component={StackCalendarNavigator}
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
        name="StackStandingsNavigator"
        component={StackStandingsNavigator}
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
        name="StackArchiveNavigator"
        component={StackArchiveNavigator}
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

const HomeBottomNavigator = () => (
  <BottomNavigator initialRouteName="StackHomeNavigator" />
);
const CalendarBottomNavigator = () => (
  <BottomNavigator initialRouteName="StackCalendarNavigator" />
);
const StandingsBottomNavigator = () => (
  <BottomNavigator initialRouteName="StackStandingsNavigator" />
);
const ArchiveBottomNavigator = () => (
  <BottomNavigator initialRouteName="ArchiveBottomNavigator" />
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerContentStyle: { backgroundColor: Theme.colors.darken },
        drawerLabelStyle: {
          fontFamily: Theme.fonts.special,
          color: Theme.colors.primary,
          fontSize: 12,
        },
        drawerActiveBackgroundColor: Theme.colors.secondary,
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="HomeBottomNavigator"
        component={HomeBottomNavigator}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="CalendarBottomNavigator"
        component={CalendarBottomNavigator}
        options={{ title: "Calendar" }}
      />
      <Drawer.Screen
        name="StandingsBottomNavigator"
        component={StandingsBottomNavigator}
        options={{ title: "Standings" }}
      />
      <Drawer.Screen
        name="ArchiveBottomNavigator"
        component={ArchiveBottomNavigator}
        options={{ title: "Archive" }}
      />
      <Drawer.Screen
        name="StackAboutNavigator"
        component={StackAboutNavigator}
        options={{ title: "About" }}
      />
    </Drawer.Navigator>
  );
};

export const Routes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="RaceResult" component={RaceResult} />
      <Stack.Screen name="RaceSchedule" component={RaceSchedule} />
    </Stack.Navigator>
  );
};
