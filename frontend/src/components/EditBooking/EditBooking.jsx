import {
  Button,
  IconButton,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Container,
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
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

/**
 * given any date, return the date of the Monday of that week
 * @param {Date} d the date to get the Monday of
 */
const getMonday = (d) => {
  d = new Date(d);

  let day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

  // get the friday of that week
  let friday = new Date(d.setDate(diff + 4));

  // if that friday is in the past (i.e. the week has already passed), set the monday to the monday of the next week
  if (friday < new Date()) {
    diff += 7;
  }

  // BUG: does not handle month overflow! if the monday is in the next month, the code will break.
  // TODO: fix this!

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const EditBooking = ({ isOpen, reqID, setOpenEditRequest }) => {
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
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setOpenEditRequest(false);
  };

  const handleDetails = (e) => {
    setDetails(e.target.value);
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Booking Request
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Submit Changes
          </Button>
        </Toolbar>
      </AppBar>

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

          {group && (
            <>
              <Divider>Provide an explanation</Divider>

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
                        setScheduleDates([]);
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
                          setScheduleDates([]);
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
                          setScheduleDates([]);
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
            >
              Finish
            </Button>
          )}
        </Box>
      )}
    </Dialog>
  );
};
