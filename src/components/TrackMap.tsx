import { View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";
import { Theme } from "../theme";
import { AppText } from "./AppText";
import { TrackPoint } from "../hooks/useOpenF1";

export const SECTOR_COLORS = ["#6FB7FF", Theme.colors.sprint, Theme.colors.purple];

type Props = {
  points: TrackPoint[];
  width: number;
  height: number;
};

const PADDING = 12;

// Circuit outline from one lap of car positions, coloured by sector
export const TrackMap = ({ points, width, height }: Props) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1;
  const spanY = Math.max(...ys) - minY || 1;
  const scale = Math.min((width - PADDING * 2) / spanX, (height - PADDING * 2) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  // Car data has y pointing up; the screen's points down
  const project = (p: TrackPoint) =>
    `${(offsetX + (p.x - minX) * scale).toFixed(1)},${(height - offsetY - (p.y - minY) * scale).toFixed(1)}`;

  const all = points.map(project).join(" ");
  const sectors = [0, 1, 2].map((sector) => {
    const first = points.findIndex((p) => p.sector === sector);
    const last = points.length - 1 - [...points].reverse().findIndex((p) => p.sector === sector);
    // Overlap one point into the next sector so the lines join up
    return first === -1 ? "" : points.slice(first, last + 2).map(project).join(" ");
  });
  const [startX, startY] = project(points[0]).split(",").map(Number);

  return (
    <View style={{ gap: 8 }}>
      <Svg width={width} height={height} accessibilityLabel="Circuit map">
        <Polyline
          points={all}
          fill="none"
          stroke={Theme.colors.lightOff}
          strokeWidth={12}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {sectors.map((line, index) =>
          line ? (
            <Polyline
              key={index}
              points={line}
              fill="none"
              stroke={SECTOR_COLORS[index]}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null
        )}
        <Circle cx={startX} cy={startY} r={6} fill={Theme.colors.background} stroke={Theme.colors.text} strokeWidth={2.5} />
      </Svg>
      <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
        {SECTOR_COLORS.map((color, index) => (
          <View key={color} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 14, height: 4, borderRadius: 2, backgroundColor: color }} />
            <AppText size={12} color={Theme.colors.muted}>
              Sector {index + 1}
            </AppText>
          </View>
        ))}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: Theme.colors.text }} />
          <AppText size={12} color={Theme.colors.muted}>
            Start
          </AppText>
        </View>
      </View>
    </View>
  );
};
