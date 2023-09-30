import { ReactNode, useState } from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { Theme } from "../theme";
import { SectionTitle } from "./SectionTitle";

type Props = {
  name: string;
  title?: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
  expansable?: boolean;
  startClosed?: boolean;
};

export const SectionContainer = ({
  name,
  title,
  description,
  children,
  right,
  expansable,
  startClosed,
}: Props) => {
  const [contentVisible, setContentVisible] = useState(!startClosed);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SectionTitle>{name}</SectionTitle>
        {expansable && (
          <IconButton
            icon={contentVisible ? "chevron-up" : "chevron-down"}
            size={28}
            iconColor={Theme.colors.primary}
            onPress={() => setContentVisible((isVisible) => !isVisible)}
          />
        )}
      </View>
      <View
        style={{
          borderBottomColor: Theme.colors.primary,
          borderBottomWidth: 1,
          paddingBottom: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          {title && (
            <Text
              variant="bodyLarge"
              style={{
                color: Theme.colors.primary,
                fontFamily: Theme.fonts.bold,
              }}
            >
              {title}
            </Text>
          )}

          {description && (
            <Text
              variant="bodyLarge"
              style={{
                color: Theme.colors.primary,
              }}
            >
              {description}
            </Text>
          )}
        </View>
        {right}
      </View>
      {contentVisible && children}
    </>
  );
};
