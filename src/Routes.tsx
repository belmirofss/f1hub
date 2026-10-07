import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Theme } from "./theme";
import { TabBar } from "./components/TabBar";
import { Home } from "./screens/Home/Home";
import { Calendar } from "./screens/Calendar/Calendar";
import { Standings } from "./screens/Standings/Standings";
import { Archive } from "./screens/Archive/Archive";
import { Season } from "./screens/Archive/Season";
import { RaceWeekend } from "./screens/RaceWeekend/RaceWeekend";
import { Settings } from "./screens/Settings/Settings";
import { Driver } from "./screens/Driver/Driver";
import { Team } from "./screens/Team/Team";
import { Circuit } from "./screens/Circuit/Circuit";
import { TeammatesScreen } from "./screens/Standings/Teammates";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    sceneContainerStyle={{ backgroundColor: Theme.colors.background }}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Calendar" component={Calendar} />
    <Tab.Screen name="Standings" component={Standings} />
    <Tab.Screen name="Archive" component={Archive} />
  </Tab.Navigator>
);

export const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="RaceWeekend" component={RaceWeekend} />
      <Stack.Screen name="Season" component={Season} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Driver" component={Driver} />
      <Stack.Screen name="Team" component={Team} />
      <Stack.Screen name="Circuit" component={Circuit} />
      <Stack.Screen name="Teammates" component={TeammatesScreen} />
    </Stack.Navigator>
  );
};
