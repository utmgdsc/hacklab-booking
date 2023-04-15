import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import {
  DateTimePicker,
  BookingSubmitted,
  ApproverSelect,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";
import { ErrorPage } from "../../layouts/ErrorPage";

export const CreateBooking = () => {
  const userInfo = useContext(UserContext);
  const [dateError, setDateError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [details, setDetails] = useState("");
  const [group, setGroup] = useState("");
  const [scheduleDates, setScheduleDates] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [validDate, setValidDate] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [approversError, setApproversError] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/groups/myGroups")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserGroups(data);
      });
  }, []);

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

    if (approvers.length === 0) {
      setApproversError(true);
      finish = false;
    } else {
      setApproversError(false);
    }

    if (!validDate) {
      finish = false;
    }

    if (!finish) {
      return;
    }

    // compile into json object
    const booking = {
      owner: userInfo["utorid"],
      group: group["_id"],
      details: details,
      title: details,
      startTime: scheduleDates[0],
      endTime: scheduleDates[scheduleDates.length - 1],
      approvers: approvers,
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
        setScheduleDates([]);
        return;
      }

      // if not the same day
      if (d.getDate() !== currDate && i > 0) {
        setDateError("please only select one day");
        setScheduleDates([]);
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
          "/null",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        console.log(res);
        if (res.status === 200) {
          setValidDate(true);
          setDateError("");
        } else if (res.status === 400) {
          setValidDate(false);
          setDateError(
            "this time overlaps with another booking, please choose a different time and/or date"
          );
          setScheduleDates([]);
        }
      });
    } else setValidDate(false);

    const newDates = dates.map((date) => {
      return date;
    });

    setScheduleDates(newDates);
  };

  if (userGroups.length <= 0) {
    return <ErrorPage />;
  } else if (submitted) {
    return (
      <SubPage name="Create a booking">
        <BookingSubmitted
          details={details}
          scheduleDates={scheduleDates}
          group={group.name}
        />
      </SubPage>
    );
  }

  return (
    <SubPage name="Create a booking">
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
              marginBottom: "4em",
              width: "100%",
            }}
          >
            <Divider>Select the group to book under</Divider>

            <FormControl fullWidth sx={{ marginTop: "1em" }}>
              <InputLabel id="group-label">Group</InputLabel>
              <Select
                labelId="group-label"
                id="group-select"
                value={group}
                fullWidth
                label="Group"
                onChange={(e) => {
                  setGroup(
                    typeof e.target.value === "string" ? "" : e.target.value
                  );
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
          <Box
            sx={{
              marginBottom: "4em",
              width: "100%",
            }}
          >
            <Divider>Provide an explanation</Divider>

            <TextField
              error={detailError}
              fullWidth
              helperText={detailError ? "An explanation is required" : ""}
              id="explanation-field"
              label="Please provide an explanation"
              minRows={4}
              multiline
              required
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                setDetailError(false);
                setShowSchedule(true);
              }}
              sx={{ marginTop: "1em" }}
            />
          </Box>
        )}
        {showSchedule && (
          <>
            <Box
              sx={{
                marginBottom: "4em",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Divider>Choose Approvers to review your request</Divider>

              <ApproverSelect setApprovers={setApprovers} />
              {approversError && (
                <Typography
                  component="p"
                  color="error"
                  sx={{ marginTop: "1em" }}
                >
                  * please select an approver
                </Typography>
              )}
            </Box>
          </>
        )}
        {showSchedule && (
          <Box
            sx={{
              marginBottom: "4em",
              width: "100%",
            }}
          >
            <Divider sx={{ marginBottom: "2em" }}>Select a date</Divider>

            <DateTimePicker
              handleScheduleDate={handleScheduleDate}
              scheduleDates={scheduleDates}
              setScheduleDates={setScheduleDates}
              reqId={null}
            />

            {dateError && (
              <Typography component="p" color="error" sx={{ marginTop: "1em" }}>
                * {dateError}
              </Typography>
            )}
          </Box>
        )}

        {showSchedule && group && (
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleFinish();
            }}
            disabled={!validDate}
          >
            Finish
          </Button>
        )}
      </Box>
    </SubPage>
  );
};
