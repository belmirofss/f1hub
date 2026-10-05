import { View } from "react-native";
import { Theme } from "../theme";
import { AppText } from "./AppText";

export type Stat = {
  label: string;
  color: string;
  who: string;
  value?: string;
};

// Pole / fastest lap / top gainer / retirements, one per row
export const StatRows = ({ stats }: { stats: Stat[] }) => (
  <View>
    {stats.map((stat, index) => (
      <View
        key={stat.label}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          minHeight: 40,
          borderTopWidth: index === 0 ? 0 : 1,
          borderTopColor: Theme.colors.lineSoft,
        }}
      >
        <AppText mono size={10} color={stat.color} style={{ width: 96, letterSpacing: 1 }}>
          {stat.label}
        </AppText>
        <AppText size={15} weight="bold" numberOfLines={1} style={{ flex: 1 }}>
          {stat.who}
        </AppText>
        {!!stat.value && (
          <AppText mono size={12} color={Theme.colors.muted} numberOfLines={1} style={{ maxWidth: "45%" }}>
            {stat.value}
          </AppText>
        )}
      </View>
    ))}
  </View>
);
