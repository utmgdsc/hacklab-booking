import {
    Box
} from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import { CustomScheduleSelector } from './CustomScheduleSelector';
import { PrevNextWeek } from './PrevNextWeek';
import { GetMonday } from '../GetMonday/GetMonday';
import axios from "../../axios";

/**
 * A Google Calendar and When2meet style date and time picker
 * @param {function} handleScheduleDate a function that takes a list of dates, and will validate them
 * @param {Date[]} scheduleDates a list of dates that are currently selected
 * @param {function} setScheduleDates a react hook that is a function that takes a list of dates, and will set the scheduleDates state
 * @returns
 */
export const DateTimePicker = ({ handleScheduleDate, scheduleDates, setScheduleDates,room }: {room: string, handleScheduleDate : (dates: Date[]) => void, scheduleDates: Date[], setScheduleDates: (dates: string[]) => void }) => {
    const [calendarDate, setDate] = useState(dayjs(new Date()));
    const [blockedDates, setBlockedDates] = useState([]);
    const [pendingDates, setPendingDates] = useState([]);

    /**
     * sets BlockedDates to the dates that are blocked for the week of startDate.
     * by blocked, we mean that there is already a request (pending or approved)
     * for that date.
     *
     * @param {date} startDate the start date of the week to get blocked dates for
     */
    const handleBlockedDates = async (startDate:Date) => {
        // the end date is 7 days after the start date
        const startMonday = dayjs(startDate).startOf("week");
        const endDate = dayjs(startMonday).add(7, "day").toDate();

        const {data} = await axios.get<{bookedRange:string[],status: BookingStatus }[]>(`/rooms/${room}/blockedDates?start_date=${startMonday.toISOString()}&end_date=${endDate.toISOString()}`);
        const blocked: Date[] = []
        const pending: Date[] = []
        data.forEach((booking) => {
            const {bookedRange: range, status} = booking;
            let start = dayjs(range[0]).startOf("hour");
            const end = dayjs(range[1]).endOf("hour");
            while (start.isBefore(end)) {
                (status === "pending" ? pending : blocked).push(start.toDate());
                start = start.add(1, "hour");
            }
        })
        setBlockedDates(blocked);
        setPendingDates(pending);
    };

    useEffect(() => {
        handleBlockedDates(calendarDate.toDate());
    }, [calendarDate, room]);

    return (
        <>
            <PrevNextWeek
                    calendarDate={calendarDate}
                    setDate={setDate}
                    setScheduleDates={setScheduleDates}
                    handleBlockedDates={handleBlockedDates}
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
                        calendarDate={calendarDate.toDate()}
                        blockedDates={blockedDates}
                        pendingDates={pendingDates}
                />
            </Box>
        </>
    );
}
