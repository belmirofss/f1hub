import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../theme";
import { SectionTitle } from "./SectionTitle";

type Props = {
  name: string;
  title?: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
};

export const SectionContainer = ({
  name,
  title,
  description,
  children,
  right,
}: Props) => {
  return (
    <>
      <SectionTitle>{name}</SectionTitle>
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
      {children}
    </>
  );
};
