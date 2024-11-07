import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
import { formatRangedTime } from '..';

/**
 * return a formatted date string in the format of "Monday, January 1, 2021"
 * @param scheduleDate the date to format
 * @return the formatted date string
 */
const getDateString = (scheduleDate: Date | string): string => {
    const d = new Date(scheduleDate);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
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
 * @property {string} groupName the name of the group
 * @property {string} details the details of the booking
 * @property {Array<Date>} scheduleDates the dates of the booking
 * @property {string} title the title of the page
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
                Time: {formatRangedTime(scheduleDates[0], scheduleDates[scheduleDates.length - 1])}
            </Typography>
        </Container>
    );
};
