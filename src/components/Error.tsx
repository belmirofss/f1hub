import React from "react";
import { Pressable, View } from "react-native";
import { Theme } from "../theme";
import { AppText } from "./AppText";

type Props = {
  onRetry?: () => void;
};

export const Error = ({ onRetry }: Props) => {
  return (
    <View
      style={{
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        padding: Theme.space.m,
        gap: Theme.space.s,
      }}
    >
      <AppText color={Theme.colors.muted} style={{ textAlign: "center" }}>
        Couldn't load this right now.
      </AppText>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          style={{
            minHeight: 40,
            paddingHorizontal: Theme.space.m,
            borderRadius: Theme.radius.m,
            borderWidth: 1,
            borderColor: Theme.colors.line,
            justifyContent: "center",
          }}
        >
          <AppText weight="bold">Try again</AppText>
        </Pressable>
      )}
    </View>
  );
};
