import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import ScheduleSelector from 'react-schedule-selector';
import { GetMonday } from '../../components';
import { THEME } from '../../theme/theme';

/**
 * A custom schedule selector in the format
 *    Mon
 *   1 Jan
 * @param {Date} date the date to render
 * @returns a label for the date on the schedule selector
 */
const RenderDateLabel = (date: Date) => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                marginBottom: '0.5em',
            }}
        >
            {date.toLocaleDateString('en-US', {
                weekday: 'short',
            })}
            <Typography component="p" variant="h5">
                {date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                })}
            </Typography>
        </Box>
    );
};

/**
 * A label for the time on the schedule selector in the format:
 *  12am
 * @param {Date} time the time to render
 * @returns a label for the time on the schedule selector
 */
const RenderTimeLabel = (time: Date) => {
    return (
        <Typography
            component="p"
            variant="subtitle2"
            color="gray"
            sx={{ textAlign: 'right', marginRight: '0.5em' }}
            fontSize="small"
        >
            {time
                .toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })
                .replace(':00', '')
                .replace(' ', '')
                .toLowerCase()}
        </Typography>
    );
};

/**
 * A when2meet-like schedule selector that supports dark mode
 *
 * @param {Date[]} scheduleDates the dates that are selected
 * @param {(dates: Date[]) => void} handleScheduleDate a react usestate function that is called when a date is selected
 * @param {Date} calendarDate the current date of the week to show
 * @param {Date[]} blockedDates the dates that are blocked off as they are already booked
 * @param {Date[]} pendingDates the dates that are pending approval
 * @returns a when2meet-like schedule selector
 */
export const CustomScheduleSelector = ({
    scheduleDates,
    handleScheduleDate,
    calendarDate,
    blockedDates,
    pendingDates,
}: {
    scheduleDates: Date[];
    handleScheduleDate: (dates: Date[]) => void;
    calendarDate: Date;
    blockedDates: Date[];
    pendingDates: Date[];
}) => {
    const theme = useTheme();

    const customDateCellRenderer = (date: Date, selected: boolean, refSetter: React.Ref<unknown>) => {
        const blocked =
            blockedDates.filter((blockedDate) => {
                return blockedDate.getTime() === date.getTime();
            }).length > 0;
        const pending =
            pendingDates.filter((blockedDate) => {
                return blockedDate.getTime() === date.getTime();
            }).length > 0;
        const inPast = date.getTime() < new Date().getTime();
        var backgroundColor;

        if (blocked) {
            backgroundColor = theme.palette.error.main + '!important';
        } else if (selected) {
            backgroundColor = theme.palette.action.active + '!important';
        } else if (pending) {
            backgroundColor = theme.palette.warning.main + '!important';
        } else if (inPast) {
            backgroundColor = theme.palette.action.hover + '!important';
        } else {
            backgroundColor = theme.palette.action.disabled;
        }

        return (
            <Box
                role="presentation"
                ref={refSetter}
                sx={{
                    backgroundColor: backgroundColor,
                    height: '25px',
                    width: '100%',
                    placeSelf: 'stretch',
                    touchAction: 'none',
                    '&:hover': {
                        backgroundColor: theme.palette.action.disabled,
                    },
                }}
            />
        );
    };

    return (
        <ScheduleSelector
            selection={scheduleDates}
            numDays={5}
            minTime={8}
            maxTime={22}
            hourlyChunks={1}
            startDate={GetMonday(calendarDate)}
            onChange={(scheduleDates) => {
                handleScheduleDate(scheduleDates);
            }}
            selectionScheme="linear"
            renderDateLabel={(date) => RenderDateLabel(date)}
            renderTimeLabel={(time) => RenderTimeLabel(time)}
            renderDateCell={customDateCellRenderer}
        />
    );
};
