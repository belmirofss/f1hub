import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Theme } from "../theme";

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Theme.colors.dark,
        height: "100%",
        padding: Theme.space.s,
      }}
    >
      <ActivityIndicator size="large" color={Theme.colors.secondary} />
    </View>
  );
};
