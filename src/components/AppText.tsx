import { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { Theme } from "../theme";

type Weight = "regular" | "semibold" | "bold" | "black";

type Props = {
  children: ReactNode;
  size?: number;
  weight?: Weight;
  mono?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityLabel?: string;
};

const FONT_BY_WEIGHT: Record<Weight, string> = {
  regular: Theme.fonts.regular,
  semibold: Theme.fonts.semibold,
  bold: Theme.fonts.bold,
  black: Theme.fonts.black,
};

export const AppText = ({
  children,
  size = 15,
  weight = "regular",
  mono,
  color = Theme.colors.text,
  style,
  numberOfLines,
  accessibilityLabel,
}: Props) => {
  const fontFamily = mono
    ? weight === "bold" || weight === "black"
      ? Theme.fonts.monoBold
      : Theme.fonts.mono
    : FONT_BY_WEIGHT[weight];

  return (
    <Text
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      style={[{ fontFamily, fontSize: size, color }, style]}
    >
      {children}
    </Text>
  );
};

// Small monospaced caps label used above sections: "NEXT RACE · R18/24"
export const Label = ({
  children,
  color = Theme.colors.muted,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
}) => (
  <AppText mono size={11} color={color} style={[{ letterSpacing: 1 }, style]}>
    {children}
  </AppText>
);
