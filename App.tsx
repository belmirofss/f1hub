import "react-native-gesture-handler";
import { useCallback } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  PaperProvider,
  MD3LightTheme,
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
import { AppProvider } from "./src/context";
import { Ad } from "./src/components/Ad";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 15,
    },
  },
});

const theme = {
  ...MD3LightTheme,
  roundness: Theme.roundness,
  colors: {
    ...MD3LightTheme.colors,
    primary: Theme.colors.primary,
    primaryContainer: Theme.colors.primary,
    secondary: Theme.colors.secondary,
    secondaryContainer: Theme.colors.secondary,
  },
  fonts: configureFonts({
    config: {
      fontFamily: Theme.fonts.regular,
    },
  }),
  dark: true,
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
    <View
      onLayout={onLayoutRootView}
      style={{ flex: 1, backgroundColor: Theme.colors.dark }}
    >
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <AppProvider>
            <Ad />
            <NavigationContainer>
              <Routes />
            </NavigationContainer>
          </AppProvider>
          <StatusBar hidden />
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );
}
