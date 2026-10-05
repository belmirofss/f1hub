import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Theme } from "../theme";
import { useSettings } from "../settings/SettingsContext";

export const Loading = () => {
  const { accent } = useSettings();

  return (
    <View
      style={{
        flex: 1,
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        padding: Theme.space.m,
      }}
    >
      <ActivityIndicator size="large" color={accent} />
    </View>
  );
};
