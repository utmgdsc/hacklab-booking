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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Input,
    Chip,
    Avatar,
    Grid,
    Stack,
    Divider,
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { InitialsAvatar } from "../../components";


let people = [
    {
        name: "Hatsune Miku",
        email: "h.miku@utoronto.ca",
        utorid: "hatsunem",
        admin: true,
    },
    {
        name: "Kagamine Rin",
        email: "k.rin@mail.utoronto.ca",
        utorid: "kagaminr",
        admin: false,
    },
    {
        name: "Kagamine Len",
        email: "k.len@mail.utoronto.ca",
        utorid: "kagaminl",
        admin: false,
    }
]
const group = {
    people: people,
    name: "Google Developers Student Club",
    faculty_representative: {
        name: "Yowane Haku",
        email: "y.haku@cs.toronto.edu",
        utorid: "yowanh"
    }
}

export const Group = () => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // hack demo code
    const addMegurineLuka = () => {
        people.push({
            name: "Megurine Luka",
            email: "m.luka@mail.utoronto.ca",
            utorid: "megurinel",
            admin: false,
        });
    }

    const handleDelete = (person) => {
        console.log('deleting', person);
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
                        />
                    </DialogContent>
                    <DialogActions
                        sx={{
                            margin: "1em",
                        }}
                    >
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => {handleClose(); addMegurineLuka(); }} variant="contained">Add</Button>
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
                                    handleDelete(person);
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
