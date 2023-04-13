import {
    Box,
    Typography,
    useTheme
} from "@mui/material";
import { React } from "react";
import ScheduleSelector from "react-schedule-selector";
import { GetMonday } from "../../components";

/**
 * A custom schedule selector in the format
 *    Mon
 *   1 Jan
 * @param {Date} date the date to render
 * @returns a label for the date on the schedule selector
 */
const RenderDateLabel = (date) => {
    return (
        <Box
            sx={{
                textAlign: "center",
                marginBottom: "0.5em",
            }}
        >
            {date.toLocaleDateString("en-US", {
                weekday: "short",
            })}
            <Typography component="p" variant="h5">
                {date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
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
const RenderTimeLabel = (time) => {
    return (
        <Typography
            component="p"
            variant="subtitle2"
            color="gray"
            sx={{ textAlign: "right", marginRight: "0.5em" }}
            size="small"
        >
            {time
                .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })
                .replace(":00", "")
                .replace(" ", "")
                .toLowerCase()}
        </Typography>
    );
};

/**
 * A when2meet-like schedule selector that supports dark mode
 *
 * @param {Object} scheduleDates a react hook
 * @param {Function} handleScheduleDate a react hook
 * @param {Date} calendarDate the current date of the week to show
 * @returns a when2meet-like schedule selector
 */
export const CustomScheduleSelector = ({ scheduleDates, handleScheduleDate, calendarDate, blockedDates }) => {
    const theme = useTheme();

    const customDateCellRenderer = (date, selected) => {
        const blocked = (blockedDates.filter(blockedDate => { return blockedDate.getTime() === date.getTime(); }).length > 0);

        return (
            <Box sx={{
                backgroundColor: (blocked ? theme.palette.error.main + "!important" : (selected ? theme.palette.action.active : theme.palette.action.hover)),
                height: "25px",
                width: "100%",
                "&:hover": {
                    backgroundColor: theme.palette.action.disabled,
                },
            }} />

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
            onChange={
                (scheduleDates) => {
                    handleScheduleDate(scheduleDates);
                }
            }
            selectionScheme="linear"
            renderDateLabel={(date) => RenderDateLabel(date)}
            renderTimeLabel={(time) => RenderTimeLabel(time)}
            unselectedColor={theme.palette.action.hover}
            selectedColor={theme.palette.action.active}
            hoveredColor={theme.palette.action.disabled}
            renderDateCell={customDateCellRenderer}
        />
    );
};