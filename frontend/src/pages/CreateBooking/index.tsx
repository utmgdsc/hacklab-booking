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
import { useContext, useEffect, useState } from "react";
import {
  DateTimePicker,
  BookingSubmitted,
  ApproverSelect,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";
import { ErrorPage } from "../../layouts/ErrorPage";
import axios from "../../axios";

export const CreateBooking = () => {
  const { userInfo } = useContext(UserContext);
  const [dateError, setDateError] = useState<string | boolean>(false);
  const [room, setRoom] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [detailError, setDetailError] = useState(false);
  const [details, setDetails] = useState("");
  const [group, setGroup] = useState<string>("");
  const [scheduleDates, setScheduleDates] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [validDate, setValidDate] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [approversError, setApproversError] = useState(false);
  useEffect(()=>{
    setUserGroups(userInfo.groups);
  }, [userInfo.groups])
    useEffect(() => {
      axios.get<Room[]>("/rooms").then((res) => {
        setRooms(res.data);
      });
    },[]);
  // useEffect(() => {
  //   fetch(process.env.REACT_APP_API_URL + "/groups/myGroups")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setUserGroups(data);
  //     });
  // }, []);

  const handleFinish = async () => {
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
      roomName: room,
      owner: userInfo["utorid"],
      groupId: group,
      description: details,
      title: details,
      startDate: scheduleDates[0],
      endDate: scheduleDates[scheduleDates.length - 1],
      approvers: approvers,
    };

    console.log(booking);
    console.log(group);

    const {status, data} = await axios.post("/requests/create", booking);
    if (status === 200) {
        setSubmitted(true);
        return;
    }
    // todo error handling

    // // submit to API
    // fetch(process.env.REACT_APP_API_URL + "/requests/submit", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(booking),
    // });


  };

  const handleScheduleDate = (dates: string[]) => {
    let currDate = 0;
    setDateError("");
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
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
          groupName={group}
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
                  setGroup(e.target.value);
                }}
              >
                {userGroups.map((group) => {
                  return (
                    <MenuItem value={group.id} key={group.id}>
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
            <Divider>Select the room to book</Divider>

            <FormControl fullWidth sx={{ marginTop: "1em" }}>
              <InputLabel id="room-label">Room</InputLabel>
              <Select
                labelId="room-label"
                id="room-select"
                value={room}
                fullWidth
                label="Room"
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              >
                {rooms.map((room) => {
                  return (
                    <MenuItem value={room.roomName} key={room.roomName}>
                      {room.roomName} - {room.friendlyName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {group && room && (
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
            <Divider sx={{ marginBottom: "2em" }}>
              Choose Approvers to review your request
            </Divider>

            <Box
              sx={{
                marginBottom: "4em",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
              room={room}
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