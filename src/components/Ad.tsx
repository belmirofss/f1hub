import { useEffect, useState } from "react";
import { Snackbar, Portal, Text } from "react-native-paper";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { useAppContext } from "../hooks/useAppContext";
import { AD_UNIT_ID } from "../constants";
import { Theme } from "../theme";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : AD_UNIT_ID;

export const Ad = () => {
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
          Showing ad in 5 seconds. Ad helps us to mantain the app.
        </Text>
      </Snackbar>
    </Portal>
  );
};
