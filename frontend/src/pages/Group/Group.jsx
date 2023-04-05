import React, {useEffect} from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { InitialsAvatar } from "../../components";
import { Routes, Route, useParams } from 'react-router-dom';

// let people = [
//     {
//         name: "Hatsune Miku",
//         email: "h.miku@utoronto.ca",
//         utorid: "hatsunem",
//         admin: true,
//     },
//     {
//         name: "Kagamine Rin",
//         email: "k.rin@mail.utoronto.ca",
//         utorid: "kagaminr",
//         admin: false,
//     },
//     {
//         name: "Kagamine Len",
//         email: "k.len@mail.utoronto.ca",
//         utorid: "kagaminl",
//         admin: false,
//     }
// ]
// const group = {
//     people: people,
//     name: "Google Developers Student Club",
//     faculty_representative: {
//         name: "Yowane Haku",
//         email: "y.haku@cs.toronto.edu",
//         utorid: "yowanh"
//     }
// }

export const Group = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { id: groupID } = useParams();

  const [people, setPeople] = React.useState([]);
  const [group, setGroup] = React.useState({});
  const [inviteUtorid, setInviteUtorid] = React.useState('');

  const getGroups = () => {
    fetch(process.env.REACT_APP_API_URL + '/groups/search/byID/' + groupID, {
      method: 'GET',
    }).then(res => {
      console.log(res)
      return res.json();
    }).then(data => {
      console.log('data')
      console.log(data);
      setGroup(data);
      setPeople(data.people);
    })
  }

  useEffect(() => {
    getGroups();
  }, []);

  const addPerson = (utorid) => {
    console.log('adding', utorid)
    fetch(process.env.REACT_APP_API_URL + '/groups/invite/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: groupID,
        utorid: utorid
      })
    }).then(res => {
      return res.json();
    }).then(data => {
      console.log(data);
      getGroups();
    })
  }

  const removePerson = (person) => {
    console.log('deleting', person);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const makeAdmin = (person) => {

  }

  return (
    <SubPage name={group.name}>
      {/* menu bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1em",
          justifyContent: "flex-end",
        }}>
        <Button variant="contained" onClick={handleClickOpen}>
          Add Student
        </Button>
        <Button color="error">
          Delete Group
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="add-student-title"
        >
          <DialogTitle id="add-student-title">
            {"Add a student to your group"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a student to your group, please enter their UTORid below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="utorid"
              label="UTORid"
              type="text"
              fullWidth
              value={inviteUtorid}
              onChange={(e) => setInviteUtorid(e.target.value)}
            />
          </DialogContent>
          <DialogActions
            sx={{
              margin: "1em",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {handleClose(); addPerson(inviteUtorid); setInviteUtorid('')}} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* list of people in the group */}
      {
        people.map((person) => (
          <Card key={person.utorid}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1em",
              }}>
              <Box>
                <InitialsAvatar name={person.name} />
              </Box>
              <Box>
                <Typography variant="h5">{person.name}</Typography>
                {person.admin ? <Typography color="success">Group manager</Typography> : null}
                <Typography variant="body1">{person.email}</Typography>
              </Box>
            </CardContent>
            <CardActions>
              {
                person.admin ? null : (
                  <Button
                    onClick={() => {
                      console.log("make admin");
                    }}
                  >
                    Make Admin
                  </Button>
                )
              }

              <Button
                color="error"
                onClick={() => {
                  console.log("remove student");
                }}
              >
                Remove Student
              </Button>

            </CardActions>
          </Card>
        ))
      }
    </SubPage>
  );
};
