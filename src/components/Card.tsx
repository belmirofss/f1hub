import { ReactNode } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { useSettings } from "../settings/SettingsContext";

export const Card = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <View
    style={[
      {
        backgroundColor: Theme.colors.surface,
        borderColor: Theme.colors.line,
        borderWidth: 1,
        borderRadius: Theme.radius.l,
        padding: Theme.space.m,
        gap: Theme.space.s,
      },
      style,
    ]}
  >
    {children}
  </View>
);

// "Results →" style inline link in a card header
export const InlineLink = ({
  children,
  onPress,
}: {
  children: string;
  onPress: () => void;
}) => {
  const { accent } = useSettings();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="link"
      style={{ minHeight: 32, justifyContent: "center" }}
    >
      <AppText size={13} weight="bold" color={accent}>
        {children} →
      </AppText>
    </Pressable>
  );
};

export const IconButton = ({
  icon,
  onPress,
  label,
  bordered = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;
  bordered?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => ({
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: bordered ? 1 : 0,
      borderColor: Theme.colors.line,
      backgroundColor: pressed ? Theme.colors.surfaceRaised : "transparent",
    })}
  >
    <Ionicons name={icon} size={20} color={Theme.colors.text} />
  </Pressable>
);

// Whole-card button with a chevron: "Teammate battle >", "Circuit guide >"
export const LinkCard = ({
  children,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: Theme.space.s,
      padding: Theme.space.m,
      borderRadius: Theme.radius.l,
      borderWidth: 1,
      borderColor: Theme.colors.line,
      backgroundColor: pressed ? Theme.colors.surfaceRaised : Theme.colors.surface,
    })}
  >
    <View style={{ flex: 1, gap: 6 }}>{children}</View>
    <Ionicons name="chevron-forward" size={18} color={Theme.colors.muted} />
  </Pressable>
);

export const TeamBar = ({ color, height = 26 }: { color: string; height?: number }) => (
  <View style={{ width: 3, height, borderRadius: 2, backgroundColor: color }} />
);

export const EmptyState = ({ children }: { children: string }) => (
  <View style={{ paddingVertical: Theme.space.l, alignItems: "center" }}>
    <AppText color={Theme.colors.muted} style={{ textAlign: "center" }}>
      {children}
    </AppText>
  </View>
);
