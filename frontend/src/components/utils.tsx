/** @filesummary This file contains small utility functions. */
import dayjs from 'dayjs';

/**
 * Converts ISP 8601 date string to more readable format
 * @property date The date string in DD-MM-YYYY or ISP 8601 format
 * @returns The localized date string
 */
export const convertDate = (date: string | Date): string => {
    let dateObj: Date;

    // parse the date string into a date object
    if (typeof date === 'string') {
        // parse the date string into a date object
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }

    // convert the date object into a string with the desired format
    // undefined to use the browser's locale
    const dateStr = dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // return the date string
    return dateStr;
};

/**
 * given any date, return the date of the Monday of that week.
 *
 * if it is the weekend, return the next Monday.
 *
 * @property d the date to get the Monday of
 */
export const getMonday = (d: Date | dayjs.Dayjs): Date => {
    let dayjsObj = dayjs(d);
    const day = dayjsObj.day();
    switch (day) {
        case 0: // sunday - one day until monday
            dayjsObj = dayjsObj.add(1, 'day');
            break;
        case 1: // monday
            break;
        case 2:
        case 3:
        case 4:
        case 5: // tuesday - friday: get current monday
            dayjsObj = dayjsObj.subtract(day - 1, 'day');
            break;
        case 6: // saturday - two days until monday
            dayjsObj = dayjsObj.add(2, 'day');
            break;
        default:
            throw new Error('Invalid day');
    }

    return dayjsObj.toDate();
};

/**
 * get a hash of a string that is also a color code
 * @returns the color code in hsl format
 */
export const colorHash = ({
    name = '',
    lightness = 50,
}: {
    /** the name to get the hash of */
    name?: string;
    /** the lightness of the color */
    lightness?: number;
}): string => {
    let hash = 95;

    // use djb2 algorithm to get a hash of the name
    for (let i = 0; i < name.length; i++) {
        // ascii + hash * 33
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 120);
    const saturation = Math.abs(hash % 100);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * adds `number` hours to `date`
 * @property date date to add hours to
 * @property hours the number of hours to add
 * @return the new date with the hours added
 */
export const addHoursToDate = (date: Date, hours: number): Date => {
    const newDate = new Date(date.getTime());
    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    return newDate;
};

/**
 * Given a start and end time, return a localized string its the time range.
 *
 * Be aware that there be one hour added to the end time, this is to account
 * for the fact that HB only allows bookings to be made in hour increments with
 * non-inclusive end times.
 *
 * @property startDate The start date of the booking
 * @property endDate The end date of the booking
 * @return A formatted string of the time range of the booking
 */
export const formatRangedTime = (startDate: Date | string, endDate: Date | string): string => {
    const formatDateOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
    };

    const startHour = new Date(startDate).toLocaleTimeString(undefined, formatDateOptions);
    const endHour = addHoursToDate(new Date(endDate), 1).toLocaleTimeString(undefined, formatDateOptions);
    return `${startHour} - ${endHour}`;
};
