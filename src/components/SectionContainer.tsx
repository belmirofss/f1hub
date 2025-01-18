import React, { ReactNode } from "react";
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Theme } from "../theme";
import { SectionTitle } from "./SectionTitle";
import { Error } from "./Error";

type Props = {
  name: string;
  title?: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
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
  isLoading,
  isError,
}: Props) => {
  return (
    <React.Fragment>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 56,
        }}
      >
        <SectionTitle>{name}</SectionTitle>

        {isLoading && (
          <ActivityIndicator
            size="small"
            color={Theme.colors.secondary}
            style={{ marginRight: Theme.space.xs }}
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
        {!isLoading && (
          <>
            <View>
              {title && (
                <Text
                  variant="titleMedium"
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

      {!isLoading && <>{isError ? <Error /> : children}</>}
    </React.Fragment>
  );
};
