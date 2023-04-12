import {
  Button,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Container,
  Box,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Tooltip,
  Select,
  Divider,
  getListItemSecondaryActionClassesUtilityClass,
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import { forwardRef } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ScheduleSelector from "react-schedule-selector";
import { Link } from "../../components";
import { UserContext } from "../../contexts/UserContext";

const {addHours} = require('date-fns');

/**
 * given any date, return the date of the Monday of that week.
 *
 * if it is the weekend, return the next Monday.
 *
 * @param {Date} d the date to get the Monday of
 */
const getMonday = (d) => {
  d = new dayjs(d);
  var day = d.day();

  switch (day) {
    case 0: // sunday - get the next monday
      d = d.add(1, "day");
      break;
    case 1: // monday
      break;
    case 2:
    case 3:
    case 4:
    case 5: // tuesday - friday: get current monday
      d = d.subtract(day - 1, "day");
      break;
    case 6: // saturday - get the next monday
      d = d.add(2, "day");
      break;
    default:
      throw new Error("Invalid day");
  }

  return d.toDate();
};

/**
 * return a formatted date string in the format of "Monday, January 1, 2021"
 * @param {*} scheduleDate the date to format
 * @return {string} the formatted date string
 */
const getDateString = (scheduleDate) => {
  var d = new Date(scheduleDate);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * given an array of dates, return a formatted string of the time range
 * from the first date to the last date in the format:
 *
 * "from 12:00 to 13:00"
 *
 * @param {*} scheduleDates the array of dates
 * @return {string} the formatted time string
 */
const getTimeString = (scheduleDates) => {
  var dStart = new Date(scheduleDates[0]);
  let endDate = new Date(scheduleDates[scheduleDates.length - 1]);
  endDate = addHours(endDate, 1);
  var dEnd = new Date(endDate);
  return `from ${dStart.getHours()}:00 to ${dEnd.getHours()}:00`;
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const EditBooking = ({ isOpen, reqID, setOpenEditRequest }) => {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/groups/myGroups")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserGroups(data);
      });
  }, []);

  const [reqInfo, setReqInfo] = useState({});

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/requests/getRequest/" + reqID)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setReqInfo(data);
        console.log(data, "reqInfo");
        setDetails(data.description);
      });
  }, []);

  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [details, setDetails] = useState("");
  const [detailError, setDetailError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [datePastError, setDatePastError] = useState(false);
  const [calendarDate, setDate] = useState(dayjs(new Date()));
  const [calendarDateError, setCalendarDateError] = useState(false);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [scheduleError, setScheduleError] = useState(false);
  const [validDate, setValidDate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [group, setGroup] = useState("");
  const [timeTakenError, setTimeTakenError] = useState(false);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setOpenEditRequest(false);
  };

  const handleFinish = () => {
    let finish = true;

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

    let endDate = new Date(scheduleDates[scheduleDates.length - 1]);

    const modifiedRequest = {
      group: group["_id"],
      details: details,
      title: details,
      startTime: scheduleDates[0],
      endTime: addHours(endDate, 1),
    };

    fetch(process.env.REACT_APP_API_URL + "/requests/modifyRequest/" + reqID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modifiedRequest),
    });

    setSubmitted(true);
  };

  const handleDetails = (e) => {
    setDetails(e.target.value);
  };

  const handleScheduleDate = (dates) => {
    var currDate = 0;
    setDateError(false);
    setDatePastError(false);
    setTimeTakenError(false);
    for (var i = 0; i < dates.length; i++) {
      var d = new Date(dates[i]);
      // if in the past
      if (d < new Date()) {
        setDatePastError(true);
        return;
      }

      // if not the same day
      if (d.getDate() !== currDate && i > 0) {
        setDateError(true);
        return;
      }
      // console.log(`Day: ${d.getDate()}, Hour: ${d.getHours()}`);
      currDate = d.getDate();
    }
    if (dates.length > 0) {
      fetch(
        process.env.REACT_APP_API_URL +
          "/requests/checkDate/" +
          dates[0] +
          "/" +
          dates[dates.length - 1] +
          "/" +
          reqID,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        console.log(res);
        if (res.status === 200) {
          setValidDate(true);
          setTimeTakenError(false);
        } else if (res.status === 400) {
          setValidDate(false);
          setTimeTakenError(true);
        }
      });
      setScheduleError(false);
    } else setValidDate(false);

    const newDates = dates.map((date) => {
      return date;
    });

    setScheduleDates(newDates);
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Booking Request
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="cancel"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 8, marginBottom: "2em" }} maxWidth={"md"}>
        {submitted ? (
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "nowrap",
              marginBottom: "1em",
              marginTop: "2em",
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
              Booking Changed
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
              marginTop: "2em",
            }}
          >
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
                <Divider>Select the group to book under</Divider>

                <FormControl fullWidth sx={{ marginTop: "1em" }}>
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
                      setShowSchedule(true);
                    }}
                  >
                    {userGroups.map((group) => {
                      return (
                        <MenuItem value={group} key={group}>
                          {group.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            )}

            {group && (
              <>
                <Divider>Provide an explanation</Divider>

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
                    marginTop: "1em",
                  }}
                  minRows={4}
                  helperText={detailError ? "An explanation is required" : ""}
                  id="explanation-field"
                />
              </>
            )}
            {showSchedule && (
              <>
                <Divider>Select a date</Divider>

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
                        color="gray"
                        onClick={() => {
                          setDate(dayjs());
                          // setScheduleDates([]);
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
                        <IconButton
                          onClick={() => {
                            setDate(calendarDate.subtract(7, "day"));
                            // setScheduleDates([]);
                          }}
                          disabled={calendarDate
                            .subtract(7, "day")
                            .isBefore(dayjs(), "day")}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Next week">
                        <IconButton
                          onClick={() => {
                            setDate(calendarDate.add(7, "day"));
                            // setScheduleDates([]);
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography component="p" variant="h5">
                      {getMonday(calendarDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                  <Box>
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
                          setScheduleDates([]);
                        }}
                        disablePast
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box
                  onMouseDown={() => {
                    setScheduleDates([]);
                  }}
                  sx={{
                    marginBottom: "1em",
                    width: "100%",
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
                </Box>
                {dateError && (
                  <Typography
                    component="p"
                    color="error"
                    sx={{ marginTop: "1em" }}
                  >
                    * please only select one day
                  </Typography>
                )}
                {datePastError && (
                  <Typography
                    component="p"
                    color="error"
                    sx={{ marginTop: "1em" }}
                  >
                    * do not select a day in the past
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
                {timeTakenError && (
                  <Typography
                    component="p"
                    color="error"
                    sx={{ marginTop: "1em" }}
                  >
                    * this time overlaps with another booking, please choose a
                    different time and/or date
                  </Typography>
                )}
              </>
            )}

            {calendarDate && showSchedule && group && (
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  handleFinish();
                }}
                sx={{
                  marginTop: "2em",
                }}
                disabled={
                  details === "" ||
                  calendarDateError === null ||
                  scheduleDates.length === 0 ||
                  !validDate ||
                  !showSchedule
                }
              >
                Submit Changes
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Dialog>
  );
};
