import React from "react";
import { View } from "react-native";
import { Theme } from "../theme";
import { Text } from "react-native-paper";

export const Error = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Theme.colors.background,
        height: "100%",
        padding: Theme.space.s,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: Theme.colors.common,
          fontFamily: Theme.fonts.special,
        }}
      >
        Somenthing went wrong! Try again later.
      </Text>
    </View>
  );
};
