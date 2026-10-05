import { Pressable, View } from "react-native";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { useSettings } from "../settings/SettingsContext";

type Option<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "regular" | "small";
};

// Filled switch: "Drivers | Constructors", "My time | Track"
export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  size = "regular",
}: Props<T>) => {
  const small = size === "small";

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        backgroundColor: small ? "transparent" : Theme.colors.surface,
        borderColor: Theme.colors.line,
        borderWidth: 1,
        borderRadius: Theme.radius.m,
        padding: small ? 0 : 3,
        overflow: "hidden",
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: option.disabled }}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
            style={{
              flex: small ? undefined : 1,
              minHeight: small ? 30 : 40,
              paddingHorizontal: small ? 10 : 8,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: small ? 0 : Theme.radius.s,
              backgroundColor: selected ? Theme.colors.text : "transparent",
              opacity: option.disabled ? 0.35 : 1,
            }}
          >
            <AppText
              size={small ? 12 : 14}
              weight="bold"
              color={selected ? Theme.colors.background : Theme.colors.muted}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

// Underlined tabs: "Schedule  Race  Sprint  Qualifying"
export const Tabs = <T extends string>({ options, value, onChange }: Props<T>) => {
  const { accent } = useSettings();

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        gap: Theme.space.l,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.line,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: option.disabled }}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
            style={{
              minHeight: 44,
              justifyContent: "center",
              borderBottomWidth: 2,
              borderBottomColor: selected ? accent : "transparent",
              marginBottom: -1,
              opacity: option.disabled ? 0.35 : 1,
            }}
          >
            <AppText
              size={14}
              weight="bold"
              color={
                option.disabled
                  ? Theme.colors.subtle
                  : selected
                  ? Theme.colors.text
                  : Theme.colors.muted
              }
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
