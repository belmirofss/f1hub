import { useCallback } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Theme } from "./src/theme";
import { Routes } from "./src/Routes";
import Horizon from "./src/fonts/Horizon.otf";
import RobotoBold from "./src/fonts/Roboto-Bold.ttf";
import RobotoRegular from "./src/fonts/Roboto-Regular.ttf";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 15,
    },
  },
});

const theme = {
  ...DefaultTheme,
  roundness: Theme.roundness,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.colors.primary,
  },
  fonts: configureFonts({
    config: {
      fontFamily: Theme.fonts.regular,
    },
  }),
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Horizon,
    RobotoBold,
    RobotoRegular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
          <StatusBar hidden />
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );
}
