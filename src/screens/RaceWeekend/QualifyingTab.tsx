import { View } from "react-native";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { EmptyState, TeamBar } from "../../components/Card";
import { getTeamColor } from "../../helpers/teams";
import { formatGapMs, lapTimeToMs } from "../../helpers/results";
import { QualifyingResult } from "../../types";

const bestTime = (result: QualifyingResult) => result.Q3 || result.Q2 || result.Q1;

type Session = "Q1" | "Q2" | "Q3";

type Group = { key: string; title: string; session?: Session; results: QualifyingResult[] };

// Splits the order into the session each driver reached. Older seasons
// without knockout qualifying end up as a single group with no header.
const groupBySession = (results: QualifyingResult[]): Group[] => {
  const groups: Group[] = [
    { key: "q3", title: "Q3", session: "Q3", results: results.filter((r) => r.Q3) },
    { key: "q2", title: "OUT IN Q2", session: "Q2", results: results.filter((r) => !r.Q3 && r.Q2) },
    { key: "q1", title: "OUT IN Q1", session: "Q1", results: results.filter((r) => !r.Q3 && !r.Q2 && r.Q1) },
    { key: "none", title: "NO TIME", results: results.filter((r) => !bestTime(r)) },
  ];
  return groups.filter((g) => g.results.length > 0);
};

const Row = ({ result, gap }: { result: QualifyingResult; gap?: string }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minHeight: 48,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.lineSoft,
    }}
  >
    <AppText mono weight="bold" size={14} style={{ width: 28 }}>
      {result.position}
    </AppText>
    <TeamBar color={getTeamColor(result.Constructor.constructorId)} height={26} />
    <View style={{ flex: 1 }}>
      <AppText size={14} weight="bold" numberOfLines={1}>
        {result.Driver.givenName} {result.Driver.familyName}
      </AppText>
      <AppText size={11} color={Theme.colors.muted} numberOfLines={1}>
        {result.Constructor.name}
      </AppText>
    </View>
    <View style={{ width: 84, alignItems: "flex-end" }}>
      <AppText mono weight="bold" size={13}>
        {bestTime(result) ?? "—"}
      </AppText>
      {gap && (
        <AppText mono size={11} color={Theme.colors.muted}>
          {gap}
        </AppText>
      )}
    </View>
  </View>
);

export const QualifyingTab = ({ results }: { results: QualifyingResult[] }) => {
  if (!results.length) return <EmptyState>No qualifying results yet.</EmptyState>;

  const groups = groupBySession(results);
  const showHeaders = groups.length > 1;

  return (
    <View style={{ gap: showHeaders ? 14 : 0 }}>
      {groups.map((group) => {
        // Gap to the quickest time anyone set in that session
        const session = group.session;
        const times = session
          ? results.map((r) => lapTimeToMs(r[session])).filter((t): t is number => !!t)
          : [];
        const fastestMs = times.length ? Math.min(...times) : undefined;
        return (
          <View key={group.key}>
            {showHeaders && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: Theme.colors.line,
                }}
              >
                <Label color={group.key === "q3" ? Theme.colors.text : Theme.colors.muted}>
                  {group.title}
                </Label>
                <Label>
                  P{group.results[0].position}–P{group.results[group.results.length - 1].position}
                </Label>
              </View>
            )}
            {group.results.map((result) => {
              const ms = session ? lapTimeToMs(result[session]) : undefined;
              const gap = ms && fastestMs && ms > fastestMs ? formatGapMs(ms - fastestMs) : undefined;
              return <Row key={result.Driver.driverId} result={result} gap={gap} />;
            })}
          </View>
        );
      })}
    </View>
  );
};
