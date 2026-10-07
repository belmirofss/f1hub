import { Pressable, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { Theme } from "../../theme";
import { AppText, Label } from "../../components/AppText";
import { Card, InlineLink, LinkCard, TeamBar } from "../../components/Card";
import { FormChip } from "../../components/FormChips";
import { Screen } from "../../components/Screen";
import { StatGrid } from "../../components/StatGrid";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useSettings } from "../../settings/SettingsContext";
import { useDriver } from "../../hooks/useDriver";
import { useDriverCareer } from "../../hooks/useDriverCareer";
import { useDriverSeasonPositions } from "../../hooks/useDriverSeasonPositions";
import { useTeammates } from "../../hooks/useTeammates";
import { useWikipediaSummary } from "../../hooks/useWikipediaSummary";
import { CHAMPIONS } from "../../data/champions";
import { getDriverCode, getTeamColor } from "../../helpers/teams";
import { getCountryCode3ByNationality } from "../../helpers/countries";

type ParamList = {
  Driver: { driverId: string };
};

const ordinal = (n: number) => {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      minHeight: 36,
      borderTopWidth: 1,
      borderTopColor: Theme.colors.lineSoft,
    }}
  >
    <AppText size={13} color={Theme.colors.muted}>
      {label}
    </AppText>
    <AppText size={14} weight="semibold" style={{ flexShrink: 1, textAlign: "right" }}>
      {value}
    </AppText>
  </View>
);

// Championship position per season as bars: taller = better, titles in the accent
const SeasonBars = ({ positions }: { positions: { season: string; position: number }[] }) => {
  const { accent } = useSettings();
  const shown = positions.filter((p) => p.position > 0);
  if (!shown.length) return null;
  const worst = Math.max(20, ...shown.map((p) => p.position));

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 124 }}>
        {shown.map(({ season, position }) => {
          const color =
            position === 1 ? accent : position <= 3 ? Theme.colors.text : Theme.colors.lightOff;
          return (
            <View
              key={season}
              accessible
              accessibilityLabel={`${season}: ${ordinal(position)}`}
              style={{ flex: 1, alignItems: "center", gap: 4 }}
            >
              <AppText mono weight="bold" size={11} color={position === 1 ? accent : Theme.colors.text}>
                P{position}
              </AppText>
              <View
                style={{
                  width: "100%",
                  height: Math.max(4, ((worst + 1 - position) / worst) * 96),
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  backgroundColor: color,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {shown.map(({ season }) => (
          <AppText
            key={season}
            mono
            size={10}
            color={Theme.colors.muted}
            style={{ flex: 1, textAlign: "center" }}
          >
            '{season.slice(2)}
          </AppText>
        ))}
      </View>
    </View>
  );
};

const TeammateCard = ({ driverId, season }: { driverId: string; season: string }) => {
  const navigation = useNavigation();
  const { pairs, isLoading } = useTeammates({ season });
  const pair = pairs.find((p) => p.a.driverId === driverId || p.b.driverId === driverId);
  if (isLoading || !pair) return null;

  const isA = pair.a.driverId === driverId;
  const teammate = isA ? pair.b : pair.a;
  const score = (value: [number, number]) =>
    isA ? `${value[0]}–${value[1]}` : `${value[1]}–${value[0]}`;

  return (
    <LinkCard
      onPress={() =>
        navigation.navigate("Teammates", { season, constructorId: pair.team.constructorId })
      }
      accessibilityLabel={`Teammate battle against ${teammate.familyName}`}
    >
      <Label>VS TEAMMATE · {teammate.familyName.toUpperCase()} · {season}</Label>
      <StatGrid
        stats={[
          { label: "QUALI", value: score(pair.qualifying) },
          { label: "RACE", value: score(pair.race) },
          { label: "POINTS", value: score(pair.points) },
        ]}
      />
    </LinkCard>
  );
};

export const Driver = () => {
  const { params } = useRoute<RouteProp<ParamList, "Driver">>();
  const { driverId } = params;
  const navigation = useNavigation();
  const { accent } = useSettings();

  const driver = useDriver({ driverId });
  const career = useDriverCareer({ driverId });
  const bio = useWikipediaSummary({ url: driver.data?.url });
  const seasons = (career.data?.seasons ?? []).slice(-8).map((s) => s.season);
  const standings = useDriverSeasonPositions({ driverId, seasons });

  if (driver.isLoading || career.isLoading) {
    return <Screen showBack><Loading /></Screen>;
  }
  if (driver.isError || career.isError || !driver.data || !career.data) {
    return (
      <Screen showBack>
        <Error
          onRetry={() => {
            driver.refetch();
            career.refetch();
          }}
        />
      </Screen>
    );
  }

  const info = driver.data;
  const { races, starts, wins, podiums, poles } = career.data;
  const latest = career.data.seasons.at(-1);
  const latestRaces = races.filter((r) => r.season === latest?.season);
  const latestPosition = standings.positions.find((p) => p.season === latest?.season)?.position;
  const titles = CHAMPIONS.filter((c) => c.driverId === driverId).map((c) => c.season);
  const team = latest?.team;
  const teamColor = getTeamColor(team?.constructorId);
  const recent = races.slice(-5).reverse();

  return (
    <Screen showBack meta={latest ? `DRIVER · ${latest.season}` : "DRIVER"}>
      <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
        <TeamBar color={teamColor} height={76} />
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Theme.colors.surfaceRaised,
            borderWidth: 1,
            borderColor: Theme.colors.line,
          }}
        >
          <AppText mono weight="bold" size={18} color={teamColor}>
            {getDriverCode(info)}
          </AppText>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText size={17} weight="semibold" color={Theme.colors.muted} style={{ lineHeight: 20 }}>
            {info.givenName}
          </AppText>
          <View style={{ transform: [{ skewX: "-6deg" }] }}>
            <AppText size={30} weight="black" numberOfLines={1} adjustsFontSizeToFit style={{ lineHeight: 34 }}>
              {info.familyName.toUpperCase()}
            </AppText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Label>{getCountryCode3ByNationality(info.nationality)}</Label>
            {team && (
              <Pressable
                onPress={() => navigation.navigate("Team", { constructorId: team.constructorId })}
                accessibilityRole="link"
                hitSlop={10}
              >
                <Label color={Theme.colors.text} style={{ textDecorationLine: "underline" }}>
                  {" · "}
                  {team.name.toUpperCase()}
                </Label>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {titles.length > 0 && (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 }}>
          <Ionicons name="trophy-outline" size={18} color={accent} />
          <AppText size={14} weight="bold">
            {titles.length === 1
              ? `${titles[0]} World Champion`
              : `${titles.length}× World Champion`}
          </AppText>
          {titles.length > 1 && (
            <AppText mono size={11} color={Theme.colors.muted} style={{ marginLeft: "auto" }} numberOfLines={1}>
              {titles.map((t) => `'${t.slice(2)}`).join(" ")}
            </AppText>
          )}
        </Card>
      )}

      <Card>
        {latest && (
          <>
            <Label>{latest.season} SEASON</Label>
            <StatGrid
              stats={[
                { label: "POS", value: latestPosition ? ordinal(latestPosition) : "–" },
                { label: "PTS", value: +latest.points.toFixed(1) },
                { label: "WINS", value: latest.wins },
                {
                  label: "PODIUMS",
                  value: latestRaces.filter((r) => r.position >= 1 && r.position <= 3).length,
                },
              ]}
            />
            <View style={{ height: 1, backgroundColor: Theme.colors.lineSoft }} />
          </>
        )}
        <Label>CAREER</Label>
        <StatGrid
          stats={[
            { label: "STARTS", value: starts },
            { label: "WINS", value: wins },
            { label: "PODIUMS", value: podiums },
            { label: "POLES", value: poles },
          ]}
        />
      </Card>

      {recent.length > 0 && (
        <Card style={{ gap: 0, paddingBottom: 4 }}>
          <Label style={{ paddingBottom: 8 }}>LAST {recent.length} RACES</Label>
          {recent.map((race) => (
            <Pressable
              key={`${race.season}-${race.round}`}
              onPress={() => navigation.navigate("RaceWeekend", { season: race.season, round: race.round })}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                minHeight: 48,
                borderTopWidth: 1,
                borderTopColor: Theme.colors.lineSoft,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <FormChip position={race.position} size={26} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText size={15} weight="bold" numberOfLines={1}>
                  {race.raceName}
                </AppText>
                <AppText mono size={10} color={Theme.colors.muted}>
                  {race.season} · R{race.round}
                  {race.grid > 0 ? ` · FROM P${race.grid}` : " · PIT LANE START"}
                  {race.sprintPosition ? ` · SPRINT P${race.sprintPosition}` : ""}
                </AppText>
              </View>
              <AppText mono weight="bold" size={13} color={race.points + race.sprintPoints > 0 ? Theme.colors.text : Theme.colors.muted}>
                {race.points + race.sprintPoints > 0 ? `+${race.points + race.sprintPoints}` : "0"}
              </AppText>
            </Pressable>
          ))}
        </Card>
      )}

      {!standings.isLoading && standings.positions.some((p) => p.position > 0) && (
        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Label>CHAMPIONSHIP BY SEASON</Label>
            <Label>POS</Label>
          </View>
          <SeasonBars positions={standings.positions} />
        </Card>
      )}

      {latest && <TeammateCard driverId={driverId} season={latest.season} />}

      <Card>
        <Label>ABOUT</Label>
        {!!bio.data && (
          <AppText size={15} color="#D4D4D8" style={{ lineHeight: 22 }}>
            {bio.data}
          </AppText>
        )}
        <View>
          <InfoRow
            label="Born"
            value={`${moment(info.dateOfBirth).format("D MMM YYYY")} · ${moment().diff(info.dateOfBirth, "years")} years`}
          />
          <InfoRow label="Nationality" value={info.nationality} />
          {!!info.permanentNumber && <InfoRow label="Number" value={info.permanentNumber} />}
          {races[0] && <InfoRow label="Debut" value={`${races[0].season} ${races[0].raceName}`} />}
          {titles.length > 0 && <InfoRow label="Titles" value={titles.join(", ")} />}
        </View>
        <InlineLink onPress={() => WebBrowser.openBrowserAsync(info.url)}>Read on Wikipedia</InlineLink>
      </Card>
    </Screen>
  );
};
