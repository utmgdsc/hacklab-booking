import dayjs from "dayjs";

/**
 * given any date, return the date of the Monday of that week.
 *
 * if it is the weekend, return the next Monday.
 *
 * @param {Date} d the date to get the Monday of
 */
export const GetMonday = (d) => {
    d = new dayjs(d);
    var day = d.day();

    switch (day) {
      case 0: // sunday - get the next monday
        d = d.add(1, "day");
        break;
      case 1: // monday
        break;
      case 2:
      case 3:
      case 4:
      case 5: // tuesday - friday: get current monday
        d = d.subtract(day - 1, "day");
        break;
      case 6: // saturday - get the next monday
        d = d.add(2, "day");
        break;
      default:
        throw new Error("Invalid day");
    }

    return d.toDate();
  };
