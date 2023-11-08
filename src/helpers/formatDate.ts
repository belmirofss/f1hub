import moment from "moment-timezone";

export const getTimezone = () => moment.tz.guess()

export const convertToMoment = (date: string, time?: string) => {
 return date && time ? moment(`${date} ${time}`) : moment(date);
}

export const formatDate = (date: string, time?: string) => {
  const format = date && time ? "MMM DD[,] HH:mm" : "MMM DD"
  const timezone = getTimezone();
  const momentValue = convertToMoment(date, time)
  return momentValue.tz(timezone).format(format);
};
