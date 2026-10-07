import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { EmptyState, TeamBar } from "../../components/Card";
import { Segmented } from "../../components/Segmented";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import {
  useOpenF1Drivers,
  useOpenF1RaceSession,
  useRaceControl,
  useTeamRadio,
} from "../../hooks/useOpenF1";
import { formatClock } from "../../helpers/time";
import { OpenF1Driver, Race, RaceControlMessage, TeamRadio } from "../../types";

type Filter = "all" | "radio" | "control";

type Item =
  | { kind: "radio"; time: number; lap?: number; radio: TeamRadio; driver?: OpenF1Driver }
  | { kind: "control"; time: number; lap?: number; message: RaceControlMessage };

// Blue flags are shown dozens of times a race and say little afterwards
const isNoise = (m: RaceControlMessage) => m.flag === "BLUE";

const FLAG_COLORS: Record<string, string> = {
  GREEN: Theme.colors.gain,
  CLEAR: Theme.colors.gain,
  YELLOW: Theme.colors.sprint,
  "DOUBLE YELLOW": Theme.colors.sprint,
  RED: "#FF3B3B",
  "BLACK AND WHITE": Theme.colors.text,
  CHEQUERED: Theme.colors.text,
};

const categoryLabel = (m: RaceControlMessage) => {
  if (m.message.includes("DELETED")) return { label: "TRACK LIMITS", color: Theme.colors.loss };
  if (m.message.includes("PENALTY")) return { label: "PENALTY", color: Theme.colors.loss };
  if (m.category === "SafetyCar") return { label: "SAFETY CAR", color: Theme.colors.sprint };
  if (m.category === "Flag") return { label: "FLAG", color: Theme.colors.text };
  if (m.category === "Drs") return { label: "DRS", color: Theme.colors.muted };
  return { label: "RACE CONTROL", color: Theme.colors.muted };
};

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

const Summary = ({ messages }: { messages: RaceControlMessage[] }) => {
  const yellows = messages.filter((m) => m.flag === "YELLOW" || m.flag === "DOUBLE YELLOW").length;
  const safetyCars = messages.filter((m) => /^(VIRTUAL )?SAFETY CAR DEPLOYED/.test(m.message)).length;
  const deleted = messages.filter((m) => m.message.includes("DELETED")).length;

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {[
        { value: yellows, label: "YELLOW FLAGS", color: Theme.colors.sprint },
        { value: safetyCars, label: "SAFETY CARS", color: Theme.colors.text },
        { value: deleted, label: "LAPS DELETED", color: Theme.colors.loss },
      ].map((stat) => (
        <View
          key={stat.label}
          accessible
          accessibilityLabel={`${stat.value} ${stat.label.toLowerCase()}`}
          style={{
            flex: 1,
            gap: 2,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Theme.colors.line,
            backgroundColor: Theme.colors.surface,
          }}
        >
          <AppText mono weight="bold" size={20} color={stat.color}>
            {stat.value}
          </AppText>
          <Label style={{ fontSize: 10 }}>{stat.label}</Label>
        </View>
      ))}
    </View>
  );
};

const RadioRow = ({
  item,
  playing,
  progress,
  onToggle,
}: {
  item: Extract<Item, { kind: "radio" }>;
  playing: boolean;
  progress: number;
  onToggle: () => void;
}) => {
  const { accent, onAccent, clock24 } = useSettings();
  const color = item.driver?.team_colour ? `#${item.driver.team_colour}` : Theme.colors.muted;
  const name = item.driver?.full_name
    ? `${item.driver.first_name} ${item.driver.last_name}`
    : `Car ${item.radio.driver_number}`;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
        paddingLeft: 12,
        paddingRight: 8,
        borderRadius: Theme.radius.l,
        borderWidth: 1,
        borderColor: playing ? Theme.colors.lineDashed : Theme.colors.line,
        backgroundColor: Theme.colors.surface,
      }}
    >
      <TeamBar color={color} height={30} />
      <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
          <AppText size={15} weight="bold" numberOfLines={1} style={{ flexShrink: 1 }}>
            {name}
          </AppText>
          <AppText mono size={10} color={Theme.colors.muted}>
            TEAM RADIO · {formatClock(moment.utc(item.radio.date), clock24)}
          </AppText>
        </View>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: Theme.colors.lightOff }}>
          <View
            style={{
              width: `${playing ? progress * 100 : 0}%`,
              height: "100%",
              borderRadius: 2,
              backgroundColor: accent,
            }}
          />
        </View>
      </View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${playing ? "Pause" : "Play"} radio from ${name}`}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: playing ? accent : Theme.colors.surfaceRaised,
        }}
      >
        <Ionicons name={playing ? "pause" : "play"} size={16} color={playing ? onAccent : Theme.colors.text} />
      </Pressable>
    </View>
  );
};

const ControlRow = ({ message }: { message: RaceControlMessage }) => {
  const { clock24 } = useSettings();
  const { label, color } = categoryLabel(message);
  const flag = message.flag ? FLAG_COLORS[message.flag] : undefined;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: Theme.radius.l,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: Theme.colors.lineDashed,
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          marginTop: 2,
          borderRadius: 3,
          backgroundColor: flag ?? "transparent",
          borderWidth: flag ? 0 : 1,
          borderColor: Theme.colors.subtle,
        }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText mono size={10} color={color} style={{ letterSpacing: 1 }}>
          {label} · {formatClock(moment.utc(message.date), clock24)}
        </AppText>
        <AppText mono size={12} color="#D4D4D8" style={{ lineHeight: 18 }}>
          {message.message}
        </AppText>
      </View>
    </View>
  );
};

// Team radio clips and race control messages from OpenF1, newest first
export const RadioTab = ({ race }: { race: Race }) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [playingUrl, setPlayingUrl] = useState<string>();
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const session = useOpenF1RaceSession({ season: race.season, date: race.date });
  const key = session.data?.session_key;
  const drivers = useOpenF1Drivers(key);
  const radio = useTeamRadio(key);
  const control = useRaceControl(key);

  useEffect(() => {
    // Radio is something people tap to hear, so play it even with the ringer off (iOS)
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (status.didJustFinish) setPlayingUrl(undefined);
  }, [status.didJustFinish]);

  const toggle = (url: string) => {
    if (playingUrl === url) {
      player.pause();
      setPlayingUrl(undefined);
      return;
    }
    player.replace({ uri: url });
    player.play();
    setPlayingUrl(url);
  };

  if (session.isLoading || drivers.isLoading || radio.isLoading || control.isLoading) return <Loading />;
  if (session.isError || radio.isError || control.isError) {
    return (
      <Error
        onRetry={() => {
          session.refetch();
          radio.refetch();
          control.refetch();
        }}
      />
    );
  }
  if (!session.data) return <EmptyState>No radio or race control data for this race.</EmptyState>;

  const messages = (control.data ?? []).filter((m) => !isNoise(m));
  const driverByNumber = new Map((drivers.data ?? []).map((d) => [d.driver_number, d]));
  const laps = (control.data ?? [])
    .filter((m) => m.lap_number)
    .map((m) => ({ time: moment.utc(m.date).valueOf(), lap: m.lap_number as number }));
  // Radio has no lap number: take the lap of the last race control message before it
  const lapAt = (time: number) => [...laps].reverse().find((l) => l.time <= time)?.lap;

  const items: Item[] = [
    ...(filter === "control"
      ? []
      : (radio.data ?? []).map((r): Item => {
          const time = moment.utc(r.date).valueOf();
          return { kind: "radio", time, lap: lapAt(time), radio: r, driver: driverByNumber.get(r.driver_number) };
        })),
    ...(filter === "radio"
      ? []
      : messages.map((m): Item => ({
          kind: "control",
          time: moment.utc(m.date).valueOf(),
          lap: m.lap_number ?? undefined,
          message: m,
        }))),
  ].sort((a, b) => b.time - a.time);

  const progress = status.duration ? status.currentTime / status.duration : 0;

  return (
    <>
      <Segmented
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "radio", label: "Radio" },
          { value: "control", label: "Race control" },
        ]}
      />
      <Summary messages={control.data ?? []} />
      {items.length === 0 && <EmptyState>Nothing here for this race.</EmptyState>}
      <View>
        {items.map((item, index) => (
          <View key={`${item.kind}-${item.time}-${index}`} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ width: 40, alignItems: "center" }}>
              <AppText mono weight="bold" size={11} color={Theme.colors.muted} style={{ paddingTop: 14 }}>
                {item.lap ? `L${item.lap}` : "–"}
              </AppText>
              <View style={{ flex: 1, width: 1, marginTop: 6, backgroundColor: Theme.colors.line }} />
            </View>
            <View style={{ flex: 1, paddingBottom: 10 }}>
              {item.kind === "radio" ? (
                <RadioRow
                  item={item}
                  playing={playingUrl === item.radio.recording_url}
                  progress={progress}
                  onToggle={() => toggle(item.radio.recording_url)}
                />
              ) : (
                <ControlRow message={item.message} />
              )}
            </View>
          </View>
        ))}
      </View>
      {status.duration > 0 && playingUrl && (
        <AppText mono size={11} color={Theme.colors.muted} style={{ textAlign: "center" }}>
          {formatDuration(status.currentTime)} / {formatDuration(status.duration)}
        </AppText>
      )}
      <AppText size={12} color={Theme.colors.muted} style={{ lineHeight: 18 }}>
        Radio clips and race control messages come from OpenF1 and appear after the session.
      </AppText>
    </>
  );
};
