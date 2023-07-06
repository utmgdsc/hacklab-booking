import {
    ArrowBackIos as ArrowBackIcon,
    ArrowForwardIos as ArrowForwardIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import React from "react";
import { GetMonday } from "../../components";

/**
 * controls the previous and next week buttons, and the date picker.
 *
 * it also handles for the blocked dates
 *
 * @param {Object} scheduleDates a react hook
 * @param {Function} handleScheduleDate a react hook
 * @param {Date} calendarDate the current date of the week to show
 *
 * @returns the previous and next week buttons, and the date picker
 */
export const PrevNextWeek = ({ calendarDate = dayjs(), setDate, setScheduleDates, handleBlockedDates } : {
    calendarDate: Dayjs,
    setDate: (date: Dayjs) => void,
    setScheduleDates: (dates?: string[]) => void,
    handleBlockedDates: (date: Date | Dayjs) => void,
}) => {

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    marginBottom: "1em",
                    gap: "1em",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "1em",
                    }}
                >
                    <Box>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setDate(dayjs());
                                handleBlockedDates(calendarDate);
                            }}
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Today
                        </Button>
                    </Box>
                    <Box>
                        <Tooltip title="Previous week">
                            <span>
                                <IconButton
                                    onClick={() => {
                                        setDate(calendarDate.subtract(7, "day"));
                                        handleBlockedDates(calendarDate);
                                    }}
                                    disabled={calendarDate.subtract(7, "day").isBefore(dayjs(), "day")}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Next week">
                            <span>
                                <IconButton
                                    onClick={() => {
                                        setDate(calendarDate.add(7, "day"));
                                        handleBlockedDates(calendarDate);
                                    }}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                    <Typography component="p" variant="h5">
                        {GetMonday(calendarDate).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Typography>
                </Box>
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select a day"
                            value={calendarDate}
                            onChange={(newDate) => {
                                setDate(newDate);
                                setScheduleDates();
                                handleBlockedDates(calendarDate);
                            }}
                            disablePast
                        />
                    </LocalizationProvider>
                </Box>
            </Box >
        </>
    );
};
