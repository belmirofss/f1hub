import { useEffect, useState } from "react";
import { Snackbar, Portal, Text } from "react-native-paper";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { useAppContext } from "../hooks/useAppContext";
import { AD_UNIT_ID } from "../constants";
import { Theme } from "../theme";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : AD_UNIT_ID;

export const Ad = () => {
  const [count, setCount] = useState(5);
  const [visible, setVisible] = useState(false);

  const { adShowed, markAdAsShowed } = useAppContext();
  const { isLoaded, load, show } = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    if (isLoaded && !adShowed) {
      setVisible(true);
    }
  }, [isLoaded, adShowed]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const showAd = () => {
    show();
    markAdAsShowed();
    setVisible(false);
  };

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={showAd}
        action={{
          label: "Ok",
          onPress: showAd,
        }}
        duration={5000}
      >
        <Text style={{ color: Theme.colors.primary }}>
          Showing ad in {count} second{count > 1 ? "s" : ""}. Ad helps us to
          mantain the app.
        </Text>
      </Snackbar>
    </Portal>
  );
};
