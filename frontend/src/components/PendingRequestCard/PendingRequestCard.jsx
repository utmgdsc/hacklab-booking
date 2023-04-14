import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { ConvertDate } from ".."
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

/**
 * A card that displays a pending request
 * TODO: fetch data from backend via GUID instead of passing in props
 * @param {string} name the name of the user who sent the request
 * @param {string} utorid the utorid of the user who sent the request
 * @param {string} title the title of the request
 * @param {Date} date the date of the request
 * @param {string} description the description of the request
 * @param {string} location the location of the request
 * @param {string} teamName the name of the team that the request is for
 */
export const PendingRequestCard = ({ name, ownerID, groupID, locationID, title, date, end, description, reqID }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [utorid, setUtorid] = useState("utorid");
    const [location, setLocation] = useState("location");
    const [teamName, setTeamName] = useState("teamName");

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + "/requests/getUtorid/" + ownerID)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setUtorid(data.utorid);
            });

        fetch(process.env.REACT_APP_API_URL + "/requests/getRoom/" + locationID)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setLocation(data.friendlyName);
            });
        fetch(process.env.REACT_APP_API_URL + "/groups/getGroup/" + groupID)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setTeamName(data.name);
            });
    }, []);

    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const getTime = () => {
        let startHour = new Date(date);
        startHour = startHour.getHours();
        let endHour = new Date(end);
        endHour = endHour.getHours() + 1;
        return `${startHour}:00 - ${endHour}:00`;
      };

    const [approved, setApproved] = useState(false);

    const handleChangeStatus = (reason, status) => {
        // todo: send request to backend to approve request
        fetch(process.env.REACT_APP_API_URL + "/requests/changeStatus/" + reqID, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
                reason: reason
            }),
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });

        console.log(status + " request with reason " + reason);
    }

    return (
        <>
            <Card>
                <CardContent
                    sx={{
                        padding: "1.25em 1.25em 0"
                    }}
                >
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Request from {utorid} {teamName != null ? <>as a part of {teamName}</> : null}
                    </Typography>
                    <Typography variant="h5" component="div" fontWeight={600} gutterBottom>
                        {title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <ConvertDate date={date} /> from {getTime()} • {location}
                    </Typography>

                    <Typography variant="p">{description}</Typography>
                </CardContent>
                <CardActions>
                    <Button
                        sx={{ borderRadius: "100vw" }}
                        variant="contained"
                        color="success"
                        startIcon={<DoneIcon />}
                        onClick={() => { setApproved(true); handleClickOpen(); }}
                    >
                        Approve
                    </Button>
                    <Button
                        sx={{ px: "1em" }}
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => { setApproved(false); handleClickOpen(); }}
                    >
                        Deny
                    </Button>
                </CardActions>
            </Card>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="add-student-title"
            >
                <DialogTitle id="add-student-title">
                    {
                        approved ? "Approve " : "Deny "
                    }
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component={Typography} gutterBottom>
                        To {approved ? "approve " : "deny "} this request, please enter a reason for your decision.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reason"
                        label="Reason for decision"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        margin: "1em",
                    }}
                >
                    <Button
                        onClick={handleClose}
                        color={approved ? "success" : "error"}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            if (approved) {
                                handleChangeStatus(document.getElementById("reason").value, "approval");
                            }
                            else {
                                handleChangeStatus(document.getElementById("reason").value, "denied");
                            }
                        }}
                        variant="contained"
                        color={approved ? "success" : "error"}
                    >
                        {
                            approved ? "Approve" : "Deny"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
