import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
import dayjs from 'dayjs';

/**
 * return a formatted date string in the format of "Monday, January 1, 2021"
 * @param {Date | string} scheduleDate the date to format
 * @return {string} the formatted date string
 */
const getDateString = (scheduleDate: Date | string): string => {
    var d = new Date(scheduleDate);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * given an array of dates, return a formatted string of the time range
 * from the first date to the last date in the format:
 *
 * "from 12:00 to 13:00"
 *
 * @param {Array<Date>} scheduleDates the array of dates
 * @return {string} the formatted time string
 */
const getTimeString = (scheduleDates: Array<Date>) => {
    var dStart = new Date(scheduleDates[0]);
    let endDate = new Date(scheduleDates[scheduleDates.length - 1]);
    endDate = dayjs(endDate).add(1, 'hour').toDate();
    var dEnd = new Date(endDate);
    return `from ${dStart.getHours()}:00 to ${dEnd.getHours()}:00`;
};

interface BookingSubmittedProps {
    /** the name of the group */
    groupName: string;
    /** the details of the booking */
    details: string;
    /** the dates of the booking */
    scheduleDates: Array<Date>;
    /** the title of the page */
    title?: string;
}

/**
 * The page that is displayed after a booking is submitted
 * @param {string} groupName the name of the group
 * @param {string} details the details of the booking
 * @param {Array<Date>} scheduleDates the dates of the booking
 * @param {string} title the title of the page
 * @returns the page that is displayed after a booking is submitted
 */
export const BookingSubmitted = ({
    groupName,
    details,
    scheduleDates,
    title = 'Booking Submitted',
}: BookingSubmittedProps) => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'nowrap',
                marginBottom: '2em',
                gap: '1em',
            }}
        >
            <CheckCircleIcon
                sx={{
                    fontSize: '10em',
                    color: 'green',
                }}
            />

            <Typography component="p" variant="h3">
                {title}
            </Typography>
            <Typography component="p" variant="h5">
                Group: {groupName}
            </Typography>
            <Typography component="p" variant="h5">
                Details: {details}
            </Typography>
            <Typography component="p" variant="h5">
                Date: {getDateString(scheduleDates[0])}
            </Typography>
            <Typography component="p" variant="h5">
                Time: {getTimeString(scheduleDates)}
            </Typography>
        </Container>
    );
};
