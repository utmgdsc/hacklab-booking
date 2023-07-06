import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { GroupCard } from "../../components";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { SubPage } from "../../layouts/SubPage";

export const GroupDirectory = () => {
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** create group dialog open state */
    const [open, setOpen] = React.useState(false);
    /** mui theme object */
    const theme = useTheme();
    /** whether the dialog should be full screen */
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    /** the groups that the user is a member of */
    let [myGroups, setMyGroups] = useState<FetchedGroup[]>([]);

    const sendAddGroup = async () => {
        const { data, status } = await axios.post('/groups/create', {
            name: (document.getElementById("group-name") as HTMLInputElement).value,
        });

        if (status === 200) {
            setMyGroups((array) => [...array, data]); // add to local list of groups
            showSnackSev("Group created successfully", "success");
        } else {
            showSnackSev("Failed to create group", "error");
        }
    }

    useEffect(() => {
        axios.get('/groups')
            .then(res => {
                setMyGroups(res.data as FetchedGroup[]);
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

                    <Button variant="contained" onClick={() => {setOpen(true);}}>
                        Create Group
                    </Button>
                    <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={() => setOpen(false)}
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
                            <Button onClick={() => {setOpen(false);}}>Cancel</Button>
                            {/* todo pressing enter should press this */}
                            <Button onClick={() => { setOpen(false); sendAddGroup(); }} variant="contained">Add</Button>
                        </DialogActions>
                    </Dialog>
                </Box>

                {
                    myGroups.map((group) => {
                        return (
                            <GroupCard
                                key={group.id}
                                groupObj={group}
                            />
                        );
                    })
                }
            </>
        </SubPage>
    );
};
