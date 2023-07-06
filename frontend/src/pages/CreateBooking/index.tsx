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
  Link,
} from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";
import { ErrorPage } from "../../layouts/ErrorPage";
import axios from "../../axios";
import { SnackbarContext } from "../../contexts/SnackbarContext";

export const CreateBooking = () => {
  /** context to show snackbars */
  const { showSnackSev } = useContext(SnackbarContext);
  /** user info */
  const { userInfo } = useContext(UserContext);
  /** currently selected room name */
  const [roomName, setRoomName] = useState<string>("");
  /** list of rooms */
  const [rooms, setRooms] = useState<Room[]>([]);
  /** booking details */
  const [details, setDetails] = useState("");
  /** currently selected group name */
  const [group, setGroup] = useState<string>("");
  /** currently selected list of dates */
  const [scheduleDates, setScheduleDates] = useState([]);
  /** whether the request was submitted */
  const [submitted, setSubmitted] = useState(false);
  /** whether the date is valid */
  const [validDate, setValidDate] = useState(false);
  /** list of approvers */
  const [approvers, setApprovers] = useState([]);

  // get list of rooms
  useEffect(() => {
    axios.get<Room[]>("/rooms").then((res) => {
      setRooms(res.data);
    });
  }, []);

  /**
   * Checks if the date is not blocked
   * @param dates list of dates
   */
    const checkDate = async (dates: Date[]) => {
      axios.get(`/rooms/${roomName}/blockeddates`, {
        params: {
          start_date: dates[0],
          end_date: dates[dates.length - 1],
        }
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.length > 0) {
              setValidDate(false);
              showSnackSev("This time overlaps with another booking, please choose a different time and/or date", "error");
              setScheduleDates([]);
            } else {
              setValidDate(true);
            }
          } else {
            setValidDate(false);
            showSnackSev("An error occurred while checking the date, please try again", "error");
            setScheduleDates([]);
          }
        });
    };

  /**
   * Validate the booking request and submit if valid
   */
  const handleFinish = async () => {
    let finish = true;

    if (details === "") {
      showSnackSev("An explanation is required to submit", "error");
      finish = false;
    }

    if (scheduleDates.length === 0) {
      showSnackSev("Please select a time", "error");
      finish = false;
    }

    if (approvers.length === 0) {
      showSnackSev("Please select an approver", "error");
      finish = false;
    }

    if (group === "") {
      showSnackSev("Please select a group", "error");
      finish = false;
    }

    if (roomName === "") {
      showSnackSev("Please select a room", "error");
      finish = false;
    }

    await checkDate(scheduleDates).then(() => {
      if (!validDate) {
        finish = false;
      }
    })

    if (!finish) {
      return;
    }

    // compile into json object
    const booking = {
      roomName,
      owner: userInfo["utorid"],
      groupId: group,
      description: details,
      title: details,
      startDate: scheduleDates[0],
      endDate: scheduleDates[scheduleDates.length - 1],
      approvers,
    };

    console.log(booking);

    const { status, data } = await axios.post("/requests/create", booking);
    if (status === 200) {
      setSubmitted(true);
      return;
    } else {
      showSnackSev("Could not create booking request", "error");
    }
  };

  const handleScheduleDate = (dates: Date[]) => {
    let currDate = 0;
    for (let i = 0; i < dates.length; i++) {
      const d = dates[i];
      // if in the past
      if (d < new Date()) {
        showSnackSev("Please select a date in the future", "error");
        setScheduleDates([]);
        return;
      }

      // if not the same day
      if (d.getDate() !== currDate && i > 0) {
        showSnackSev("Please only select one day", "error");
        setScheduleDates([]);
        return;
      }
      // console.log(`Day: ${d.getDate()}, Hour: ${d.getHours()}`);
      currDate = d.getDate();
    }

    setValidDate(true);

    if (dates.length > 0) {
      checkDate(dates);
    }

    const newDates = dates.map((date) => {
      return date;
    });

    setScheduleDates(newDates);
  };

  /*
   * cases where user cannot create a booking or booking was successful
   */
  if (userInfo.groups.length <= 0) {
    return <ErrorPage
      name="Cannot create booking"
      message={<Typography>Please{' '}
        <Link internal href="/group">create a group</Link>{' '}
        before making a booking request.</Typography>}
    />;
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

  /*
   * case where user can create a booking
   */
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
        {userInfo.groups.length > 0 && (
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
                {userInfo.groups.map((group) => {
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
                value={roomName}
                fullWidth
                label="Room"
                onChange={(e) => {
                  setRoomName(e.target.value);
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

        {group && roomName && (
          <Box
            sx={{
              marginBottom: "4em",
              width: "100%",
            }}
          >
            <Divider>Provide an explanation</Divider>

            <TextField
              fullWidth
              id="explanation-field"
              label="Please provide an explanation"
              minRows={4}
              multiline
              required
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
              sx={{ marginTop: "1em" }}
            />
          </Box>
        )}
        {(group && roomName && (details !== "")) && (
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
            </Box>
          </>
        )}
        {(group && roomName && (details !== "") && approvers.length > 0) && (
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
              room={roomName}
            />
          </Box>
        )}

        {(group && roomName && (details !== "") && approvers.length > 0) && (
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleFinish();
            }}
            disabled={!validDate || scheduleDates.length <= 0}
          >
            Finish
          </Button>
        )}
      </Box>
    </SubPage>
  );
};
