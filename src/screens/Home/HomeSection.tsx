import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";
import { HomeSectionName } from "./HomeSectionName";

type Props = {
  name: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

export const HomeSection = ({ name, title, description, children }: Props) => {
  return (
    <>
      <HomeSectionName>{name}</HomeSectionName>
      <View
        style={{
          borderBottomColor: Theme.colors.primary,
          borderBottomWidth: 1,
          paddingBottom: 6,
        }}
      >
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
      {children}
    </>
  );
};
