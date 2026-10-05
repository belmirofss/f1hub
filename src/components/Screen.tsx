import { ReactNode } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { IconButton } from "./Card";

type Props = {
  title?: string;
  // Small mono line next to the title or above it on detail screens
  meta?: string;
  showBack?: boolean;
  right?: ReactNode;
  // Rendered under the title, outside the scroll area (tabs, filters…)
  header?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export const Screen = ({
  title,
  meta,
  showBack,
  right,
  header,
  children,
  scroll = true,
  contentStyle,
}: Props) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <View
        style={{
          paddingTop: insets.top + (showBack ? 8 : 18),
          paddingHorizontal: Theme.space.m,
          paddingBottom: Theme.space.s,
          gap: Theme.space.s,
        }}
      >
        {showBack ? (
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -10 }}>
              <IconButton
                icon="chevron-back"
                label="Back"
                bordered={false}
                onPress={() => navigation.goBack()}
              />
              {meta && (
                <AppText mono size={12} color={Theme.colors.muted} style={{ letterSpacing: 1 }}>
                  {meta}
                </AppText>
              )}
              <View style={{ marginLeft: "auto" }}>{right}</View>
            </View>
            {title && (
              <AppText size={26} weight="bold" style={{ lineHeight: 30 }}>
                {title}
              </AppText>
            )}
          </View>
        ) : (
          title && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // Text meta sits on the title's baseline; buttons stay centred
                alignItems: right ? "center" : "baseline",
              }}
            >
              <AppText size={28} weight="bold">
                {title}
              </AppText>
              {right ??
                (meta && (
                  <AppText mono size={12} color={Theme.colors.muted}>
                    {meta}
                  </AppText>
                ))}
            </View>
          )
        )}
        {header}
      </View>

      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            { padding: Theme.space.m, paddingTop: 4, gap: 14, paddingBottom: Theme.space.l },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </View>
  );
};
