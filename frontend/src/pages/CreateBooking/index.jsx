import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { React, useContext, useEffect, useState } from "react";
import ScheduleSelector from "react-schedule-selector";
import { Link } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";

/**
 * given any date, return the date of the Monday of that week
 * @param {Date} d the date to get the Monday of
 */
const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const getDateString = (scheduleDate) => {
  var d = new Date(scheduleDate);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getTimeString = (scheduleDates) => {
  var dStart = new Date(scheduleDates[0]);
  var dEnd = new Date(scheduleDates[scheduleDates.length - 1]);
  return `from ${dStart.getHours()}:00 to ${dEnd.getHours()}:00`;
};

export const CreateBooking = () => {
  const userInfo = useContext(UserContext);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    document.title = 'Hacklab Booking - Create Booking';

    fetch(process.env.REACT_APP_API_URL + "/groups/myGroups")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserGroups(data);
      });
  }, []);

  // use for testing purposes
  useEffect(() => {
    setUserGroups([{name: "GDSC"}, {name: "MDSC"}]);
  }, []);

  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [details, setDetails] = useState("");
  const [detailError, setDetailError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [calendarDate, setDate] = useState(dayjs(new Date()));
  const [calendarDateError, setCalendarDateError] = useState(false);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [scheduleError, setScheduleError] = useState(false);
  const [validDate, setValidDate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [group, setGroup] = useState(null);
  const open = Boolean(anchorEl);

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

    // compile into json object
    const booking = {
      owner: userInfo['utorid'],
      group: group,
      reason: reason,
      details: details,
      title: details,
      startTime: scheduleDates[0],
      endTime: scheduleDates[scheduleDates.length - 1],
    };

    // submit to API
    fetch(process.env.REACT_APP_API_URL + "/requests/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

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

  if (userGroups.length > 0) {
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
              Group: {group.name}
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
                variant={reason === "club" ? "contained" : "outlined"}
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
                For a club or organization
              </Button>
              <Button
                size="large"
                color={reason === "academic" ? "success" : "primary"}
                variant={reason === "academic" ? "contained" : "outlined"}
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
                For a class or academic purpose
              </Button>
            </Box>

            {userGroups.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  marginBottom: "2em",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="group-label">Group</InputLabel>
                  <Select
                    labelId="group-label"
                    id="group-select"
                    value={group}
                    label="Group"
                    sx={{
                      marginBottom: "1em",
                      minWidth: "20em",
                    }}
                    onChange={(e) => {
                      setGroup(e.target.value);
                    }}
                  >
                    {userGroups.map((group) => {
                      return (
                        <MenuItem value={group}>{group.name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            )}
            <TextField
              label="Please provide an explanation"
              required
              onChange={(e) => {
                handleDetails(e);
                setDetailError(false);
                setShowSchedule(true);
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

            {showSchedule && (
              <>
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
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <ScheduleSelector
                  selection={scheduleDates}
                  numDays={5}
                  minTime={8}
                  maxTime={22}
                  hourlyChunks={1}
                  startDate={getMonday(calendarDate)}
                  onChange={handleScheduleDate}
                  selectionScheme="linear"
                  renderDateLabel={(date) => {
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
                  }}
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
              </>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={() => {
                handleFinish();
              }}
              sx={{
                marginTop: "2em",
              }}
            >
              Finish
            </Button>
          </Box>
        )}
      </SubPage>
    );
  } else {
    return (
      <SubPage name="Cannot create booking">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: "1em",
          }}
        >
          <Typography variant="h4" component="p">
            Please{" "}
            <Link isInternalLink href="/group">
              create a group
            </Link>{" "}
            before making a booking request.
          </Typography>
        </Box>
      </SubPage>
    );
  }
};
