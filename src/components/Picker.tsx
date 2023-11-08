import { useState } from "react";
import { View, ScrollView } from "react-native";
import { Button, Menu, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../theme";

type Item = {
  value: string;
  text: string;
};

type Props = {
  label: string;
  selected: string;
  items: Item[];
  onSelection: (value: string) => void;
};

export const Picker = ({ label, selected, items, onSelection }: Props) => {
  const [visible, setVisible] = useState(false);

  const text = items.find((item) => item.value == selected)?.text;

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <View>
          <Button
            onPress={() => setVisible(true)}
            style={{
              backgroundColor: Theme.colors.darken,
            }}
            contentStyle={{
              borderRadius: 100,
              borderWidth: 1,
              borderColor: Theme.colors.primary,
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
            icon={() => (
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color={Theme.colors.primary}
              />
            )}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: Theme.colors.primary,
                fontFamily: Theme.fonts.bold,
              }}
            >
              {text || label}
            </Text>
          </Button>
        </View>
      }
      overlayAccessibilityLabel="Close picker"
      contentStyle={{
        borderRadius: Theme.roundness,
        backgroundColor: Theme.colors.darken,
        width: 200,
        maxHeight: 350,
        overflow: "scroll",
      }}
    >
      <ScrollView style={{ maxHeight: 350 }}>
        {items.map((item) => (
          <Menu.Item
            onPress={() => {
              onSelection(item.value);
              setVisible(false);
            }}
            title={item.text}
            key={item.value}
            titleStyle={{
              color: Theme.colors.primary,
            }}
          />
        ))}
      </ScrollView>
    </Menu>
  );
};
