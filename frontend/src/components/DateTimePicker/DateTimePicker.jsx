import {
    Box
} from "@mui/material";
import dayjs from "dayjs";
import { React, useState } from "react";

import { CustomScheduleSelector } from './CustomScheduleSelector';
import { PrevNextWeek } from './PrevNextWeek';

/**
 * A Google Calendar and When2meet style date and time picker
 * @param {function} handleScheduleDate a function that takes a list of dates, and will validate them
 * @param {Date[]} scheduleDates a list of dates that are currently selected
 * @param {function} setScheduleDates a react hook that is a function that takes a list of dates, and will set the scheduleDates state
 * @returns
 */
export const DateTimePicker = ({ handleScheduleDate, scheduleDates, setScheduleDates }) => {
    const [calendarDate, setDate] = useState(dayjs(new Date()));
    const [blockedDates, setBlockedDates] = useState([]);

    return (
        <>
            <PrevNextWeek
                calendarDate={calendarDate}
                setDate={setDate}
                setScheduleDates={setScheduleDates}
                setBlockedDates={setBlockedDates}
            />
            <Box
                onMouseDown={() => {
                    setScheduleDates([]);
                }}

                sx={{
                    marginBottom: "1em",
                    width: "100%",
                }}
            >
                <CustomScheduleSelector
                    scheduleDates={scheduleDates}
                    handleScheduleDate={handleScheduleDate}
                    calendarDate={calendarDate}
                    blockedDates={blockedDates}
                />
            </Box>
        </>
    );
}
