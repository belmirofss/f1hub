import { useState } from "react";
import { Share } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { Tabs } from "../../components/Segmented";
import { IconButton } from "../../components/Card";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { useRaceSchedule } from "../../hooks/useRaceSchedule";
import { useRaceResults } from "../../hooks/useRaceResult";
import { useSprintResults } from "../../hooks/useSprintResults";
import { useQualifyingResults } from "../../hooks/useQualifyingResults";
import { getSessions } from "../../helpers/sessions";
import { formatClock, formatDay, formatShortDate } from "../../helpers/time";
import { getCountryCode3ByName } from "../../helpers/countries";
import { ScheduleTab } from "./ScheduleTab";
import { ResultsTab } from "./ResultsTab";
import { QualifyingTab } from "./QualifyingTab";
import { AnalysisTab } from "./AnalysisTab";
import { RadioTab } from "./RadioTab";
import { OPENF1_FIRST_SEASON } from "../../hooks/useOpenF1";

type ParamList = {
  RaceWeekend: { season: string; round: string; tab?: "analysis" | "radio" };
};

type Tab = "schedule" | "race" | "sprint" | "qualifying" | "analysis" | "radio";

export const RaceWeekend = () => {
  const { params } = useRoute<RouteProp<ParamList, "RaceWeekend">>();
  const { season, round } = params;
  const { clock24 } = useSettings();
  const [selected, setSelected] = useState<Tab | undefined>(params.tab);

  const schedule = useRaceSchedule({ season, round });
  const raceResults = useRaceResults({ season, round });
  const qualifying = useQualifyingResults({ season, round });
  const race = schedule.data?.MRData.RaceTable.Races[0];
  const sprint = useSprintResults({ season: race?.Sprint ? season : undefined, round });

  const results = raceResults.data?.MRData.RaceTable.Races[0]?.Results ?? [];
  const sprintResults = sprint.data?.MRData.RaceTable.Races[0]?.SprintResults ?? [];
  const qualifyingResults =
    qualifying.data?.MRData.RaceTable.Races[0]?.QualifyingResults ?? [];
  const pole = qualifyingResults[0];

  const hasRadio = Number(season) >= OPENF1_FIRST_SEASON;
  const tab: Tab = selected ?? (results.length ? "race" : "schedule");

  // Results decide the opening tab and which tabs are enabled, so wait for
  // them too; otherwise the screen opens on Schedule and jumps to Race.
  if (schedule.isLoading || raceResults.isLoading || qualifying.isLoading || sprint.isLoading) {
    return <Screen showBack><Loading /></Screen>;
  }
  if (schedule.isError || !race) {
    return <Screen showBack><Error onRetry={schedule.refetch} /></Screen>;
  }

  const sessions = getSessions(race);
  const raceSession = sessions[sessions.length - 1];

  const share = () => {
    const lines = sessions.map(
      (s) => `${formatDay(s.start)} ${s.hasTime ? formatClock(s.start, clock24) : ""} · ${s.name}`
    );
    Share.share({ message: `${race.raceName} ${race.season}\n${lines.join("\n")}\n\nvia F1HUB` });
  };

  return (
    <Screen
      showBack
      title={race.raceName}
      meta={`R${race.round} · ${getCountryCode3ByName(race.Circuit.Location.country)} · ${formatShortDate(raceSession.start)}`}
      right={<IconButton icon="share-outline" label="Share schedule" bordered={false} onPress={share} />}
      header={
        <Tabs<Tab>
          value={tab}
          onChange={setSelected}
          options={[
            { value: "schedule", label: "Schedule" },
            { value: "race", label: "Race", disabled: !results.length },
            ...(race.Sprint
              ? [{ value: "sprint" as Tab, label: "Sprint", disabled: !sprintResults.length }]
              : []),
            { value: "qualifying", label: "Qualifying", disabled: !qualifyingResults.length },
            { value: "analysis", label: "Analysis", disabled: !results.length },
            ...(hasRadio
              ? [{ value: "radio" as Tab, label: "Radio", disabled: !results.length }]
              : []),
          ]}
        />
      }
    >
      {tab === "schedule" && <ScheduleTab race={race} />}
      {tab === "race" && <ResultsTab results={results} pole={pole} />}
      {tab === "sprint" && <ResultsTab results={sprintResults} />}
      {tab === "qualifying" && <QualifyingTab results={qualifyingResults} />}
      {tab === "analysis" && <AnalysisTab race={race} results={results} />}
      {tab === "radio" && <RadioTab race={race} />}
    </Screen>
  );
};
