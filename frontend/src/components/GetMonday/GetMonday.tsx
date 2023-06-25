import dayjs, { OpUnitType } from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';

/**
 * given any date, return the date of the Monday of that week.
 *
 * if it is the weekend, return the next Monday.
 *
 * @param {Date} d the date to get the Monday of
 */
export const GetMonday = (d: Date): Date => {
  dayjs.extend(isoWeek);

  let dayjsObj = dayjs(d).startOf("isoWeek" as OpUnitType);

  return dayjsObj.toDate();
};
