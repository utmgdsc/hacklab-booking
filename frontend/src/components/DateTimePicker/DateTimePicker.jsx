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
 * @param {Date[]} scheduleDates a react hook that is a list of dates that are currently selected
 * @param {function} setScheduleDates a react hook that is a function that takes a list of dates, and will set the scheduleDates state
 * @param {Date[]} blockedDates a list of dates that are blocked, i.e., already booked
 * @returns
 */
export const DateTimePicker = ({ handleScheduleDate, scheduleDates, setScheduleDates, blockedDates = [] }) => {
    const [calendarDate, setDate] = useState(dayjs(new Date()));

    return (
        <>
            <PrevNextWeek
                calendarDate={calendarDate}
                setDate={setDate}
                setScheduleDates={setScheduleDates}
            />
            <Box
                onMouseDown={() => {
                    setScheduleDates(blockedDates);
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
                />
            </Box>
        </>
    );
}
