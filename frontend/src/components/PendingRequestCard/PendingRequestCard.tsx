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
import axios from "../../axios";

interface PendingRequestCardProps {
    /** the request to display as a pending request card */
    booking: FetchedBookingRequest;
    /** a function that will be called when a user wants to edit a request */
    onUpdate: () => void;
}

/**
 * A card that displays a pending request. A pending request is a request
 * that was created by a student and is now being shown to an approver
 * for review.
 *
 * @param {FetchedBookingRequest} booking the request to display as a pending request card
 * @param {Function} onUpdate a function that will be called when a user wants to edit a request
 */
export const PendingRequestCard = ({ booking, onUpdate }: PendingRequestCardProps) => {
    /** the open/closed state of the dialog box for inputting the reason */
    const [open, setOpen] = useState<boolean>(false);
    /** the material ui theme object */
    const theme = useTheme();
    /** whether or not the dialog box should be in full screen mode */
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    /** the reason for approving or denying the request */
    const [reason, setReason] = useState<string>("");
    /** whether or not the request has been approved */
    const [approved, setApproved] = useState(false);

    /**
     * Handles clicking of the "TCard access was granted" / Approve button
     */
    const handleClickOpen = async () => {
        if (approved && booking.status === "needTCard") {
            const res = await axios.put('/rooms/' + booking.roomName + '/grantaccess', { utorid: booking.authorUtorid })
            if (res.status === 200) {
                onUpdate();
            }
            return;
        } else {
            setOpen(true);
        }
    };

    /**
     * @return {string} A formatted string of the time range of the booking
     */
    const getTime = (): string => {
        let startHour: number = (new Date(booking.startDate)).getHours();
        let endHour: number = (new Date(booking.endDate)).getHours() + 1;
        return `${startHour}:00 - ${endHour}:00`;
    };


    /**
     * Handles changing booking status in the backend
     * @param {string} reason the reason for approving or denying the request
     * @param {'approve' | 'deny'} status whether the request should be approved or denied
     */
    const handleChangeStatus = (reason: string, status: 'approve' | 'deny') => {
        axios.put(`/requests/${booking.id}/${status}`, {
            reason: reason
        })
            .then(res => {
                if (res.status === 200) {
                    onUpdate();
                }
            })
            .catch(err => {
                console.error(err);
            });
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
                        Request from {booking.authorUtorid} as a part of {booking.group.name}
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
                        color="success"
                        startIcon={<DoneIcon />}
                        onClick={() => { setApproved(true); handleClickOpen(); }}
                    >
                        {booking.status === "needTCard" ? 'TCard access was granted' : 'Approve'}
                    </Button>
                    <Button
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
                onClose={() => { setOpen(false) }}
                aria-labelledby="add-student-title"
            >
                <DialogTitle id="add-student-title">
                    {approved ? "Approve " : "Deny "} {booking.title}
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: "0" }}>
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
                        onClick={() => { setOpen(false) }}
                        color={approved ? "success" : "error"}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            if (approved) {
                                handleChangeStatus(reason, "approve");
                            } else {
                                handleChangeStatus(reason, "deny");
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
