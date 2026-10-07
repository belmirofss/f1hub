import { View } from "react-native";
import { AppText, Label } from "./AppText";

export type GridStat = {
  label: string;
  value: string | number;
  color?: string;
};

// Big mono numbers in equal columns: "423 PTS   7 WINS   18 PODIUMS"
export const StatGrid = ({ stats }: { stats: GridStat[] }) => (
  <View style={{ flexDirection: "row", gap: 8 }}>
    {stats.map((stat) => (
      <View
        key={stat.label}
        accessible
        accessibilityLabel={`${stat.value} ${stat.label.toLowerCase()}`}
        style={{ flex: 1, gap: 2 }}
      >
        <AppText mono weight="bold" size={22} color={stat.color} numberOfLines={1}>
          {stat.value}
        </AppText>
        <Label style={{ fontSize: 10 }}>{stat.label}</Label>
      </View>
    ))}
  </View>
);
