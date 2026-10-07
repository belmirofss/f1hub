import { View } from "react-native";
import { Theme } from "../theme";

type Props = {
  a: number;
  b: number;
  color: string;
  height?: number;
};

// Head-to-head bar split by the two scores; the side that's ahead takes the colour
export const SplitBar = ({ a, b, color, height = 6 }: Props) => {
  const total = a + b || 1;
  const side = (value: number, other: number) => ({
    flex: Math.max(value / total, 0.03),
    borderRadius: height / 2,
    backgroundColor: value > other ? color : Theme.colors.lineDashed,
  });

  return (
    <View style={{ flexDirection: "row", gap: 3, height }}>
      <View style={side(a, b)} />
      <View style={side(b, a)} />
    </View>
  );
};
