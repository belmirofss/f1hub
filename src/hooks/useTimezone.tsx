import moment from "moment-timezone";

export const useTimezone = () => {
  return moment.tz.guess();
};
