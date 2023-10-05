import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import { ScreenContainer } from "../../components/ScreenContainer";
import appInfo from "../../../app.json";
import { Theme } from "../../theme";
import LOGO_IMG from "../../images/F1Hub.png";

export const About = () => {
  return (
    <ScreenContainer title="About">
      <View style={{ gap: Theme.space.xs }}>
        <Text
          variant="titleMedium"
          style={{ fontFamily: Theme.fonts.bold, color: Theme.colors.primary }}
        >
          Stay up-to-date with real-time driver and constructor standings,
          explore the exciting race calendar, and dive into the F1 archives to
          relive past seasons.
        </Text>
        <Text variant="titleMedium" style={{ color: Theme.colors.primary }}>
          F1HUB will never save or collect any information about you or your
          device. F1HUB is independent and has no relationship with Formula 1.
        </Text>
      </View>
      <Image style={{ height: 124, width: 124 }} source={LOGO_IMG} />
      <Text
        variant="labelSmall"
        style={{
          fontFamily: Theme.fonts.bold,
          textAlign: "center",
          color: Theme.colors.primary,
        }}
      >
        Version: {appInfo.expo.version}
      </Text>
    </ScreenContainer>
  );
};
