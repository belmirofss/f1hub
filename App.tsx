import "react-native-gesture-handler";
import { useCallback } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  TitilliumWeb_400Regular,
  TitilliumWeb_600SemiBold,
  TitilliumWeb_700Bold,
  TitilliumWeb_900Black,
} from "@expo-google-fonts/titillium-web";
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { Theme } from "./src/theme";
import { Routes } from "./src/Routes";
import { SettingsProvider } from "./src/settings/SettingsContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Theme.colors.background,
    card: Theme.colors.background,
    border: Theme.colors.line,
    primary: Theme.colors.accent,
    text: Theme.colors.text,
  },
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
    TitilliumWeb_700Bold,
    TitilliumWeb_900Black,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
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
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <NavigationContainer theme={navigationTheme}>
              <Routes />
            </NavigationContainer>
            <StatusBar style="light" />
          </SettingsProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
}
