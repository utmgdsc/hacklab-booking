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
import axios from "../../axios";
import { SnackbarContext } from "../../contexts/SnackbarContext";


export const GroupDirectory = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { showSnackSev } = useContext(SnackbarContext);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    let [myGroups, setMyGroups] = useState<FetchedGroup[]>([]);

    // useEffect(() => {
    //     setMyGroups(userInfo.groups.reduce((obj, item) => (obj[item.id] = item, obj), {}))
    // }, [userInfo.groups])

    const sendAddGroup = async () => {
        const { data, status } = await axios.post('/groups/create', {
            name: (document.getElementById("group-name") as HTMLInputElement).value,
        })
        if (status !== 200) {
            showSnackSev("Failed to create group", "error");
        }
        console.log(data);
        setMyGroups(myGroups => ({ ...myGroups, [data.id]: data }));
        userInfo.groups.push(data)
        setUserInfo(userInfo);
        // TODO INTEGRATE

        // fetch(process.env.REACT_APP_API_URL + '/groups/create', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: document.getElementById("group-name").value,
        //         // members: [userInfo.utorid],
        //         // requests: [],
        //     }),
        // })
        //     .then(res => {
        //         return res.json();
        //     })
        //     .then(data => {
        //         console.log(data);
        //         window.location.reload(); // HACK
        //     });
    }


    // TODO INTEGRATE

    useEffect(() => {
        axios.get('/groups')
            .then(res => {
                console.log(res);
                setMyGroups(res as unknown as FetchedGroup[]);
            })
            .catch(err => {
                console.log(err);
                showSnackSev("Failed to fetch groups", "error");
            })
    }, []);

    return (
        <SubPage name="Your Groups">
            <>
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
                    myGroups.forEach((group) => {
                        console.log(myGroups);

                        return (
                            <GroupCard
                                key={group.id}
                                groupObj={group}
                            />
                        )
                    })
                }
            </>
        </SubPage>
    );
};
