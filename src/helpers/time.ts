import moment, { Moment } from "moment-timezone";

export const getTimezone = () => moment.tz.guess();

// The API sends UTC dates ("2026-10-11") and times ("12:00:00Z").
export const toMoment = (date: string, time?: string) =>
  time ? moment.utc(`${date}T${time}`) : moment.utc(date);

export const formatClock = (value: Moment, clock24: boolean, timezone?: string) =>
  value
    .clone()
    .tz(timezone ?? getTimezone())
    .format(clock24 ? "HH:mm" : "h:mm A");

export const formatDay = (value: Moment, timezone?: string) =>
  value
    .clone()
    .tz(timezone ?? getTimezone())
    .format("ddd DD")
    .toUpperCase();

export const formatShortDate = (value: Moment) =>
  value.clone().tz(getTimezone()).format("DD MMM").toUpperCase();

export const formatDateRange = (start: Moment, end: Moment) => {
  const a = start.clone().tz(getTimezone());
  const b = end.clone().tz(getTimezone());
  if (a.isSame(b, "month")) {
    return `${a.format("DD")}–${b.format("DD MMM")}`.toUpperCase();
  }
  return `${a.format("DD MMM")}–${b.format("DD MMM")}`.toUpperCase();
};

export const getUtcOffsetLabel = () => {
  const offset = moment().tz(getTimezone()).utcOffset() / 60;
  return `GMT${offset >= 0 ? "+" : ""}${offset}`;
};

export const splitDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};
