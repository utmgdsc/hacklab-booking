import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import { DateTimePicker } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";
import { NotInGroup } from "./NotInGroup";
import { Submitted } from "./Submitted";
const { addHours } = require('date-fns');

export const CreateBooking = () => {
  const userInfo = useContext(UserContext);
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

  const [details, setDetails] = useState("");
  const [detailError, setDetailError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [validDate, setValidDate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [group, setGroup] = useState("");

  const handleFinish = () => {
    let finish = true;

    if (details === "") {
      setDetailError(true);
      finish = false;
    } else {
      setDetailError(false);
    }

    if (scheduleDates.length === 0 && showSchedule) {
      setDateError("please select a time");
    }

    if (!validDate) {
      finish = false;
    }

    if (!finish) {
      return;
    }

    let endDate = new Date(scheduleDates[scheduleDates.length - 1]);

    // compile into json object
    const booking = {
      owner: userInfo["utorid"],
      group: group["_id"],
      // reason: reason,
      details: details,
      title: details,
      startTime: scheduleDates[0],
      endTime: addHours(endDate, 1),
    };

    console.log(booking);
    console.log(group);

    // submit to API
    fetch(process.env.REACT_APP_API_URL + "/requests/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    setSubmitted(true);
  };

  const handleScheduleDate = (dates) => {
    var currDate = 0;
    setDateError("");
    for (var i = 0; i < dates.length; i++) {
      var d = new Date(dates[i]);
      // if in the past
      if (d < new Date()) {
        setDateError("please select a date in the future");
        return;
      }

      // if not the same day
      if (d.getDate() !== currDate && i > 0) {
        setDateError("please only select one day");
        return;
      }
      // console.log(`Day: ${d.getDate()}, Hour: ${d.getHours()}`);
      currDate = d.getDate();
    }
    if (dates.length > 0) {
      fetch(process.env.REACT_APP_API_URL + "/requests/checkDate/" + dates[0] + "/" + dates[dates.length - 1] + "/null", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          setValidDate(true);
          setDateError("");
        }
        else if (res.status === 400) {
          setValidDate(false);
          setDateError("this time overlaps with another booking, please choose a different time and/or date");
        }
      });
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
          <Submitted
            details={details}
            scheduleDates={scheduleDates}
            group={group.name}
          />
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
                    setDetails(e.target.value);
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

                <DateTimePicker
                  handleScheduleDate={handleScheduleDate}
                  scheduleDates={scheduleDates}
                  setScheduleDates={setScheduleDates}
                />

                {dateError && (
                  <Typography
                    component="p"
                    color="error"
                    sx={{ marginTop: "1em" }}
                  >
                    * {dateError}
                  </Typography>
                )}
              </>
            )}

            {showSchedule && group && (
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
                  scheduleDates.length === 0 ||
                  !validDate ||
                  !showSchedule
                }
              >
                Finish
              </Button>
            )}
          </Box>
        )}
      </SubPage>
    );
  } else {
    return (
      <NotInGroup />
    );
  }
};
