import React from "react";
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
    Chip,
    Stack,
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { InitialsAvatar, GroupCard } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

export const GroupDirectory = () => {
    useEffect(() => {
        document.title = 'Hacklab Booking - My Groups';
    }, []);

    const userInfo = useContext(UserContext);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendAddGroup = () => {
        fetch(process.env.REACT_APP_API_URL + '/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: document.getElementById("group-name").value,
                // members: [userInfo.utorid],
                // requests: [],
            }),
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload(); // HACK
            });
    }

    let [myGroups, setMyGroups] = useState({});

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/groups/myGroups')
            .then(res => {
                return res.json();
            })
            .then(data => {
                setMyGroups(data);
                console.log(data);
            });
    }, []);

    return (
        <SubPage name="Your Groups">
            {/* menu bar */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1em",
                    justifyContent: "flex-end",
                }}>

                <Button variant="contained" onClick={handleClickOpen}>
                    Create Group
                </Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="add-student-title"
                >
                    <DialogTitle id="add-student-title">
                        {"Create a new group"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create a new group, please enter the group name below. You will be the group administrator.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="group-name"
                            label="Group Name"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions
                        sx={{
                            margin: "1em",
                        }}
                    >
                        <Button onClick={handleClose}>Cancel</Button>
                        {/* todo pressing enter should press this */}
                        <Button onClick={() => { handleClose(); sendAddGroup(); }} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {
                Object.keys(myGroups).map((key) => {
                    // console.log(myGroups[key]);
                    return (
                        <GroupCard
                            key={myGroups[key]["id"]}
                            id={myGroups[key]}
                        ></GroupCard>
                    )
                })
            }
        </SubPage>
    );
};
