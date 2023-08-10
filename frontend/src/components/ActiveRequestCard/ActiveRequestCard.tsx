import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { ConfirmationDialog, ConvertDate } from '..';

interface ActiveRequestCardProps {
    booking: FetchedBookingRequest;
    edit: (reqID: string) => void;
    cancel: (reqID: string) => void;
    viewOnly?: boolean;
    ownerHasTCard: boolean;
}

/**
 * A card that displays a active request. An active request is a request
 * that has been created by a student and is either pending approval, has been
 * approved, or has been denied. The student can edit or cancel the request.
 *
 * @param {string} name the name of the user who sent the request
 * @param {string} utorid the utorid of the user who sent the request
 * @param {string} title the title of the request
 * @param {Date} date the date of the request
 * @param {string} description the description of the request
 * @param {string} location the location of the request
 */
export const ActiveRequestCard = ({
    booking,
    edit,
    cancel,
    viewOnly = false,
    ownerHasTCard = false,
}: ActiveRequestCardProps) => {
    interface RequestStep {
        id: string;
        label: string;
        description: string;
        error?: boolean;
        completed?: boolean;
    }

    const [open, setOpen] = useState<boolean>(false);

    const steps: RequestStep[] = [
        {
            id: 'pending',
            label: 'Pending',
            description: 'Your request is pending approval',
        },
        {
            id: 'needTCard',
            label: 'Need TCard',
            description: 'Your request has been approved, but you need a TCard to access the room',
            completed: ownerHasTCard,
        },
        {
            id: 'completed',
            label: 'Completed',
            description: 'Your request has been completed',
        },
    ];

    if (booking.status === 'cancelled') {
        steps.splice(1, 0, {
            id: 'cancelled',
            label: 'Cancelled',
            description: 'Your request has been cancelled',
            error: true,
        });
    } else if (booking.status === 'denied') {
        steps.splice(1, 0, {
            id: 'denied',
            label: 'Denied',
            description: 'Your request has been denied',
            error: true,
        });
    }

    const handleEdit = () => {
        edit(booking.id);
    };

    const handleCancel = () => {
        cancel(booking.id);
    };

    /**
     * @return {string} A formatted string of the time range of the booking
     */
    const getTime = () => {
        let startHour = new Date(booking.startDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        let endHour = new Date(new Date(booking.endDate).getTime() + 1 * 60 * 60 * 1000).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${startHour} - ${endHour}`;
    };

    return (
        <>
            <Card variant="outlined" sx={{ marginBottom: '1em' }}>
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Typography variant="h5" component="div" fontWeight={600}>
                                {booking.title}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {ConvertDate(booking.startDate)} from {getTime()} • {booking.room.friendlyName} •{' '}
                                {booking.group.name} • {booking.author.name}
                            </Typography>
                        </Box>
                        {!viewOnly && booking.status !== 'cancelled' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    height: '100%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Tooltip title="Edit this Request">
                                    <IconButton
                                        aria-label="edit"
                                        component="label"
                                        onClick={handleEdit}
                                        disabled={!(booking.status === 'pending')}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel this Request">
                                    <IconButton
                                        aria-label="cancel"
                                        component="label"
                                        onClick={() => setOpen(true)}
                                        disabled={new Date(booking.endDate) <= new Date()}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>

                    <Stepper
                        activeStep={
                            booking.status === 'completed'
                                ? steps.length
                                : steps.findIndex((step) => step.id === booking.status)
                        }
                        orientation="vertical"
                    >
                        {steps.map((v, i) => (
                            <Step key={i}>
                                <StepLabel error={v.error}>{v.label}</StepLabel>
                                <StepContent>
                                    <Typography>{v.description}</Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {booking.status === 'completed' && (
                        <Paper square elevation={0} sx={{ px: 4 }}>
                            <Typography>{steps[steps.length - 1].description}</Typography>
                        </Paper>
                    )}
                </CardContent>
            </Card>
            <ConfirmationDialog
                open={open}
                setOpen={setOpen}
                title="Cancel Request"
                description="Are you sure you want to cancel this request?"
                onConfirm={handleCancel}
            />
        </>
    );
};
