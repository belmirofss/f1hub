import { View } from "react-native";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { Form } from "../hooks/useRecentForm";
import { useSettings } from "../settings/SettingsContext";

type Props = {
  form?: Form;
  size?: number;
};

const chipColors = (position: number | null, accent: string, onAccent: string) => {
  if (position === 1) return { background: accent, color: onAccent, border: accent };
  if (position && position <= 3) {
    return { background: Theme.colors.text, color: Theme.colors.background, border: Theme.colors.text };
  }
  if (position && position <= 10) {
    return { background: Theme.colors.lightOff, color: "#C9C9D0", border: Theme.colors.lightOff };
  }
  if (position === 0) return { background: "transparent", color: Theme.colors.loss, border: "#5A2A24" };
  if (position) return { background: "transparent", color: "#7A7A84", border: Theme.colors.lightOff };
  return { background: "transparent", color: Theme.colors.subtle, border: Theme.colors.lightOff };
};

const Chip = ({ position, size }: { position: number | null; size: number }) => {
  const { accent, onAccent } = useSettings();
  const { background, color, border } = chipColors(position, accent, onAccent);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: background,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <AppText mono weight="bold" size={size > 18 ? 10 : 9} color={color}>
        {position === null ? "–" : position === 0 ? "R" : position}
      </AppText>
    </View>
  );
};

// Explains the squares: shown once under any list that uses them
export const FormLegend = () => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 6 }}>
    {[
      { position: 1, label: "Win" },
      { position: 2, label: "Podium" },
      { position: 6, label: "Points" },
      { position: 14, label: "No points" },
      { position: 0, label: "Retired (DNF)" },
    ].map((item) => (
      <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Chip position={item.position} size={16} />
        <AppText size={11} color={Theme.colors.muted}>
          {item.label}
        </AppText>
      </View>
    ))}
  </View>
);

// Last results as small squares: win = accent, podium = white,
// points = grey, outside the points = outlined, retirement = "R".
export const FormChips = ({ form, size = 20 }: Props) => {
  if (!form?.length) return null;

  const label = form
    .map((p) => (p === null ? "no entry" : p === 0 ? "retired" : `P${p}`))
    .join(", ");

  return (
    <View
      accessible
      accessibilityLabel={`Last ${form.length} races: ${label}`}
      style={{ flexDirection: "row", gap: 3 }}
    >
      {form.map((position, index) => (
        <Chip key={index} position={position} size={size} />
      ))}
    </View>
  );
};
