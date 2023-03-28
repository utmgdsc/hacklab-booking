import { React, useState } from "react";
import { Button, TextField, Box, Container, Typography } from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ScheduleSelector from "react-schedule-selector";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * given any date, return the date of the Monday of that week
 * @param {Date} d the date to get the Monday of
 */
const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDateString = (scheduleDate) => {
  var d = new Date(scheduleDate);
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const getTimeString = (scheduleDates) => {
  var dStart = new Date(scheduleDates[0]);
  var dEnd = new Date(scheduleDates[scheduleDates.length - 1]);
  return `from ${dStart.getHours()}:00 to ${dEnd.getHours()}:00`;
};

export const CreateBooking = () => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [details, setDetails] = useState("");
  const [detailError, setDetailError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [calendarDate, setDate] = useState(null);
  const [calendarDateError, setCalendarDateError] = useState(false);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [scheduleError, setScheduleError] = useState(false);
  const [validDate, setValidDate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = () => {
    let finish = true;
    if (reason === "") {
      setReasonError(true);
      finish = false;
    } else {
      setReasonError(false);
    }

    if (details === "") {
      setDetailError(true);
      finish = false;
    } else {
      setDetailError(false);
    }

    if (calendarDate === null) {
      setCalendarDateError(true);
    }

    if (scheduleDates.length === 0 && showSchedule) {
      setScheduleError(true);
    }

    if (!validDate) {
      finish = false;
    }

    if (!finish) {
      return;
    }

    // submit to API
    // compile into json object
    const booking = {
      reason: reason,
      details: details,
      date: calendarDate,
      startTime: scheduleDates[0],
      endTime: scheduleDates[-1],
    };
    setSubmitted(true);
  };

  const handleDetails = (e) => {
    setDetails(e.target.value);
  };

  const handleScheduleDate = (dates) => {
    var currDate = 0;
    setDateError(false);
    for (var i = 0; i < dates.length; i++) {
      var d = new Date(dates[i]);
      if (d.getDate() !== currDate && i > 0) {
        setDateError(true);
        return;
      }
      // console.log(`Day: ${d.getDate()}, Hour: ${d.getHours()}`);
      currDate = d.getDate();
    }
    if (dates.length > 0) {
      setValidDate(true);
      setScheduleError(false);
    } else setValidDate(false);

    const newDates = dates.map((date) => {
      return date;
    });
    setScheduleDates(newDates);
  };

  return (
    <SubPage name="Create a booking">
      {submitted ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "nowrap",
            marginBottom: "2em",
            gap: "1em",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: "10em",
              color: "green",
            }}
          />

          <Typography component="p" variant="h3">
            Booking Submitted
          </Typography>
          <Typography component="p" variant="h5">
            Booking for: {reason}
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
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <Typography
            component="p"
            variant="h5"
            color={reasonError ? "error" : ""}
            sx={{ marginBottom: "1em" }}
          >
            {reasonError ? "*" : ""} What is the purpose of this booking?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "nowrap",
              marginTop: "1em",
              marginBottom: "3em",
              gap: "5vw",
            }}
          >
            <Button
              size="large"
              variant="contained"
              color={reason === "club" ? "success" : "primary"}
              onClick={() => {
                setReason("club");
                setReasonError(false);
              }}
              sx={{
                flexDirection: "column",
                textTransform: "none",
              }}
            >
              <GroupsIcon
                sx={{
                  fontSize: "5em",
                }}
              />
              For a club event
            </Button>
            <Button
              size="large"
              color={reason === "academic" ? "success" : "primary"}
              variant="contained"
              onClick={() => {
                setReason("academic");
                setReasonError(false);
              }}
              sx={{
                flexDirection: "column",
                textTransform: "none",
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: "5em",
                }}
              />
              Academic Related
            </Button>
          </Box>

          <TextField
            label="Please provide an explanation"
            required
            onChange={(e) => {
              handleDetails(e);
              setDetailError(false);
            }}
            value={details}
            error={detailError}
            fullWidth
            multiline
            sx={{
              marginBottom: "3em",
            }}
            minRows={4}
            helperText={detailError ? "An explanation is required" : ""}
            id="explanation-field"
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "nowrap",
              marginBottom: "3em",
              gap: "1em",
            }}
          >
            <Typography component="p" variant="h5" color="error">
              {calendarDateError ? "*" : ""}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select a day"
                value={calendarDate}
                onChange={(newDate) => {
                  setDate(newDate);
                  setCalendarDateError(false);
                  setShowSchedule(true);
                }}
              />
            </LocalizationProvider>
          </Box>

          {showSchedule && (
            <Container
              sx={{
                marginBottom: "3em",
              }}
            >
              <ScheduleSelector
                selection={scheduleDates}
                numDays={5}
                minTime={8}
                maxTime={22}
                hourlyChunks={1}
                startDate={getMonday(calendarDate)}
                onChange={handleScheduleDate}
              />
              {dateError && (
                <Typography
                  component="p"
                  color="error"
                  sx={{ marginTop: "1em" }}
                >
                  * please only select one day
                </Typography>
              )}
              {scheduleError && (
                <Typography
                  component="p"
                  color="error"
                  sx={{ marginTop: "1em" }}
                >
                  * please select a time
                </Typography>
              )}
            </Container>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleFinish();
            }}
          >
            Finish
          </Button>
        </Box>
      )}
    </SubPage>
  );
};
