import { Image, Linking, Pressable, Share, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Theme, ACCENT_OPTIONS } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Screen } from "../../components/Screen";
import { Segmented } from "../../components/Segmented";
import { useSettings } from "../../settings/SettingsContext";
import appInfo from "../../../app.json";
import LOGO_IMG from "../../images/F1Hub.png";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yabcompany.f1hub";
const DATA_SOURCE_URL = "https://github.com/jolpica/jolpica-f1";

const LinkRow = ({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 52,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.lineSoft,
      backgroundColor: pressed ? Theme.colors.surfaceRaised : "transparent",
    })}
  >
    <Ionicons name={icon} size={18} color={Theme.colors.muted} />
    <AppText size={15} weight="semibold" style={{ flex: 1 }}>
      {label}
    </AppText>
    {value && (
      <AppText size={13} color={Theme.colors.muted}>
        {value}
      </AppText>
    )}
  </Pressable>
);

export const Settings = () => {
  const { accent, setAccent, clock24, setClock24 } = useSettings();

  return (
    <Screen showBack title="Settings">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <Image source={LOGO_IMG} style={{ width: 56, height: 56, borderRadius: 12 }} />
        <View>
          <AppText size={20} weight="black">
            F1<AppText size={20} weight="black" color={accent}>HUB</AppText>
          </AppText>
          <AppText mono size={12} color={Theme.colors.muted}>
            VERSION {appInfo.expo.version}
          </AppText>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Label>ACCENT COLOUR</Label>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {ACCENT_OPTIONS.map((option) => {
            const selected = option.value === accent;
            return (
              <Pressable
                key={option.value}
                onPress={() => setAccent(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={option.name}
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: selected ? option.value : Theme.colors.line,
                  backgroundColor: Theme.colors.surface,
                }}
              >
                <View
                  style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: option.value }}
                />
                <AppText size={12} weight="semibold">
                  {option.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Label>CLOCK</Label>
        <Segmented
          value={clock24 ? "24" : "12"}
          onChange={(value) => setClock24(value === "24")}
          options={[
            { value: "24", label: "24-hour" },
            { value: "12", label: "12-hour" },
          ]}
        />
        <AppText size={12} color={Theme.colors.muted}>
          Session times follow your phone's time zone. Race weekends also show the local track time.
        </AppText>
      </View>

      <View
        style={{
          borderRadius: Theme.radius.l,
          borderWidth: 1,
          borderColor: Theme.colors.line,
          backgroundColor: Theme.colors.surface,
          overflow: "hidden",
        }}
      >
        <LinkRow
          icon="star-outline"
          label="Rate on Google Play"
          onPress={() => Linking.openURL(PLAY_STORE_URL)}
        />
        <LinkRow
          icon="share-social-outline"
          label="Share F1HUB"
          onPress={() =>
            Share.share({ message: `Formula 1 calendar, results and standings: ${PLAY_STORE_URL}` })
          }
        />
        <LinkRow
          icon="server-outline"
          label="Data source"
          value="Jolpica F1 API"
          onPress={() => WebBrowser.openBrowserAsync(DATA_SOURCE_URL)}
        />
      </View>

      <AppText size={12} color={Theme.colors.muted} style={{ lineHeight: 18 }}>
        F1HUB never stores or collects information about you or your device. F1HUB is
        independent and has no relationship with Formula 1.
      </AppText>
    </Screen>
  );
};
