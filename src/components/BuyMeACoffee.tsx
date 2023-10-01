import { useEffect, useState } from "react";
import { Image } from "react-native";
import { Banner, Text } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../theme";
import BUY_ME_A_COFFEEE from "../images/buy_me_a_coffee.png";
import { BUY_ME_A_COFFEE_URL } from "../constants";

const KEY = "F1HUB.BUY_ME_A_COFFEE";
const FIFTEEN_DAYS_MS = 1000 * 60 * 60 * 24 * 15;

export const BuyMeACoffe = () => {
  const [visible, setVisible] = useState(false);

  const dismiss = async () => {
    setVisible(false);
    AsyncStorage.setItem(KEY, new Date().toISOString());
  };

  const open = async () =>
    await WebBrowser.openBrowserAsync(BUY_ME_A_COFFEE_URL);

  const loadVisible = async () => {
    const dismissDate: string = (await AsyncStorage.getItem(KEY)) || "";
    const diff = new Date().getTime() - new Date(dismissDate).getTime();

    setVisible(Boolean(!dismissDate || diff > FIFTEEN_DAYS_MS));
  };

  useEffect(() => {
    loadVisible();
  }, []);

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: "No",
          onPress: dismiss,
          textColor: Theme.colors.light,
        },
        {
          label: "Buy me a coffee",
          onPress: open,
        },
      ]}
      icon={() => (
        <Image
          source={BUY_ME_A_COFFEEE}
          style={{
            width: 75,
            height: 75,
          }}
        />
      )}
      style={{
        backgroundColor: Theme.colors.darken,
      }}
    >
      <Text style={{ color: Theme.colors.primary }}>
        If you've enjoyed using this app, consider buying me a coffee as a token
        of appreciation.
      </Text>
    </Banner>
  );
};
