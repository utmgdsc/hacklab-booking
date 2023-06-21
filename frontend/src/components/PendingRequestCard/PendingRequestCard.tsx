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
import { useState } from 'react';
import { instance } from "../../axios";

interface PendingRequestCardProps {
    /** the request to display as a pending request card */
    booking: BookingRequest;
}

/**
 * A card that displays a pending request
 * @param {BookingRequest} booking the request to display as a pending request card
 */
// export const PendingRequestCard = ({ name, ownerID, groupID, locationID, title, date, end, description, reqID }) => {
export const PendingRequestCard = ({ booking }: PendingRequestCardProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };
    const [reason, setReason] = useState<string>("");

    const getTime = () => {
        let startHour: number = (new Date(booking.startDate)).getHours();
        let endHour: number = (new Date(booking.endDate)).getHours() + 1;
        return `${startHour}:00 - ${endHour}:00`;
    };

    const [approved, setApproved] = useState(false);

    const handleChangeStatus = (reason: string, status: string) => {
        instance.post("/requests/changeStatus/" + booking.id, {
            status: status,
            reason: reason
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        window.location.reload();
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
                        Request from {booking.authorUtorid} as a part of {booking.groupId}
                    </Typography>
                    <Typography variant="h5" component="div" fontWeight={600} gutterBottom>
                        {booking.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {ConvertDate(booking.startDate)} from {getTime()} • {booking.roomName}
                    </Typography>

                    <Typography>{booking.description}</Typography>
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
                    {booking.title}
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
                        onChange={(e) => { setReason(e.target.value); }}
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
                                handleChangeStatus(reason, "approval");
                            } else {
                                handleChangeStatus(reason, "denied");
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