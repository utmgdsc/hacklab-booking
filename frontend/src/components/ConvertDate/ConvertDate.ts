/**
 * Converts ISP 8601 date string to more unambiguous format
 * @param {string} date The date string in DD-MM-YYYY or ISP 8601 format
 * @returns {string} The localized date string
 */
export const ConvertDate = (date: string | Date): string => {
    let dateObj: Date;

    // parse the date string into a date object
    if (typeof date === "string") {
        // parse the date string into a date object
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }

    // convert the date object into a string with the desired format
    // undefined to use the browser's locale
    const dateStr = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // return the date string
    return dateStr;
}
