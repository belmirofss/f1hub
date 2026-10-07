import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { LinkCard, TeamBar } from "../../components/Card";
import { SplitBar } from "../../components/SplitBar";
import { useTeammates } from "../../hooks/useTeammates";
import { getClosestPair } from "../../helpers/headToHead";
import { getTeamColor } from "../../helpers/teams";

// The season's most even qualifying battle between teammates
export const TeammateSpotlightCard = () => {
  const navigation = useNavigation();
  const { pairs, isLoading } = useTeammates({ season: "current" });
  const pair = getClosestPair(pairs);
  if (isLoading || !pair) return null;

  const color = getTeamColor(pair.team.constructorId);
  const [a, b] = pair.qualifying;

  return (
    <LinkCard
      onPress={() =>
        navigation.navigate("Teammates", { season: "current", constructorId: pair.team.constructorId })
      }
      accessibilityLabel={`Closest teammate battle: ${pair.a.familyName} ${a}, ${pair.b.familyName} ${b} in qualifying`}
    >
      <Label>CLOSEST TEAMMATE BATTLE</Label>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TeamBar color={color} height={36} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <AppText size={15} weight="bold">
              {pair.a.familyName}
            </AppText>
            <AppText mono size={10} color={Theme.colors.muted}>
              {pair.team.name.toUpperCase()} · QUALI
            </AppText>
            <AppText size={15} weight="bold" color={Theme.colors.muted}>
              {pair.b.familyName}
            </AppText>
          </View>
          <SplitBar a={a} b={b} color={color} />
        </View>
        <AppText mono weight="bold" size={15}>
          {a}–{b}
        </AppText>
      </View>
    </LinkCard>
  );
};
