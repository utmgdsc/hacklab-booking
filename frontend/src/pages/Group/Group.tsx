import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { InitialsAvatar } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { SubPage } from "../../layouts/SubPage";
import axios from "../../axios";
import { SnackbarContext } from "../../contexts/SnackbarContext";

export const Group = () => {
  const { showSnackSev } = useContext(SnackbarContext);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { id: groupID } = useParams();

  const [people, setPeople] = React.useState([]);
  const [group, setGroup] = React.useState<FetchedGroup>({
    id: "",
    invited: [],
    managers: [],
    members: [],
    name: "",
    requests: []
  });
  const [inviteUtorid, setInviteUtorid] = React.useState('');
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const isManager = (user: User | string): boolean => {
    const userUtorid = typeof user === 'string' ? user : user.utorid;
    return !!group.managers.find(x => x.utorid === userUtorid);
  }
  const getGroup = async () => {
    const { data, status } = await axios.get<FetchedGroup>('/groups/' + groupID);
    if (status !== 200) {
      showSnackSev("Could not fetch group", "error");
      return;
    }
    setGroup(data);
  }

  useEffect(() => {
    getGroup();
  }, []);

  /**
   * Void function to invite someone to a group
   * @param utorid The utorid of the person to add
   */
  const addPerson = async (utorid: string) => {
    const { status } = await axios.post(`/groups/${groupID}/invite/`, {
      utorid
    });
    if (status === 200) {
      showSnackSev("Person added", "success");
    } else {
      showSnackSev("Could not add person", "error");
      return;
    }
    await getGroup();
  }

  /**
   * Void function to remove  someone from a group
   * @param utorid The utorid of the person to remove
   */
  const removePerson = async (utorid: string) => {
    const { status } = await axios.post(`/groups/${groupID}/remove/`, {
      utorid
    });

    if (status === 200) {
      showSnackSev("Person removed", "success");
    } else {
      showSnackSev("Could not remove person", "error");
      return;
    }
    await getGroup();
  }

  const delGroup = async () => {
    const { data, status } = await axios.delete(`/groups/${groupID}/`)
    if (status === 200) {
      showSnackSev("Group deleted", "success")
    } else {
      showSnackSev(data.message, "error");
      return;
    }
    navigate('/group', { replace: true }); // group doesnt exist, so go back
  }

  const changeRole = async (utorid: string) => {
    console.log('promoting', utorid);
    const { status } = await axios.post(`/groups/${groupID}/changerole/`, {
      utorid,
      role: isManager(utorid) ? 'member' : 'manager'
    });
    if (status !== 200) {
      showSnackSev("Could not change role", "error");
      return;
    }
    await getGroup();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <Button color="error" onClick={delGroup}>
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
            <Button onClick={() => { handleClose(); addPerson(inviteUtorid); setInviteUtorid('') }} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* list of people in the group */}
      {
        group.members.map((person) => (
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
                <Typography variant="h5">{person.name} <Typography sx={{ color: "grey", display: "inline" }}>({person.utorid})</Typography></Typography>
                {isManager(person) ? <Typography color="success">Group manager</Typography> : null}
                <Typography variant="body1">{person.email}</Typography>
              </Box>
            </CardContent>
            {userInfo.utorid === person.utorid || !isManager(userInfo) ? null : (
              <CardActions>

                <Button
                  onClick={() => {
                    changeRole(person.utorid);
                  }}
                >
                  {isManager(person) ? 'Demote to Member' : 'Make Admin'}
                </Button>

                <Button
                  color="error"
                  onClick={() => {
                    removePerson(person.utorid);
                    if (userInfo.utorid === person.utorid) {
                      navigate('/group', { replace: true });
                    }
                  }}
                >
                  Remove Student
                </Button>
              </CardActions>
            )}
          </Card>
        ))
      }
    </SubPage>
  );
};
