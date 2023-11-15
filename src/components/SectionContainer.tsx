import { ReactNode, useState } from "react";
import { View } from "react-native";
import { Text, IconButton, ActivityIndicator } from "react-native-paper";
import { Theme } from "../theme";
import { SectionTitle } from "./SectionTitle";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { TouchableRipple } from "react-native-paper";

type Props = {
  name: string;
  title?: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
  expansable?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  startClosed?: boolean;
};

export const SectionContainer = ({
  name,
  title,
  description,
  children,
  right,
  expansable,
  isLoading,
  isError,
  startClosed,
}: Props) => {
  const [contentVisible, setContentVisible] = useState(!startClosed);

  return (
    <>
      <TouchableRipple
        onPress={() => setContentVisible((isVisible) => !isVisible)}
        rippleColor={Theme.colors.darken}
        disabled={!expansable || isLoading}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 56,
            marginTop: Theme.space.xs,
          }}
        >
          <SectionTitle>{name}</SectionTitle>
          {expansable && !isLoading && (
            <IconButton
              icon={contentVisible ? "chevron-up" : "chevron-down"}
              size={28}
              iconColor={Theme.colors.primary}
            />
          )}
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={Theme.colors.secondary}
              style={{ marginRight: Theme.space.xs }}
            />
          )}
        </View>
      </TouchableRipple>

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
        {contentVisible && (
          <>
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
          </>
        )}
      </View>

      {contentVisible && <>{isError ? <Error /> : children}</>}
    </>
  );
};
