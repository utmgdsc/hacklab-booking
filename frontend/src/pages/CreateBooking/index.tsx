import { Box, Button, Divider, TextField, CircularProgress, Collapse, Modal, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios, { catchAxiosError } from '../../axios';
import { ApproverPicker, BookingSubmitted, DateTimePicker, GroupPicker, Link, RoomPicker } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { UserContext } from '../../contexts/UserContext';
import { ErrorPage } from '../../layouts/ErrorPage';
import { SubPage } from '../../layouts/SubPage';
import { TransitionGroup } from 'react-transition-group';

/**
 * Edit a booking given a UUID or create a new booking if no UUID is given
 */
export const CreateModifyBooking = ({ editID }: { editID?: string }) => {
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** user info */
    const { userInfo, fetchUserInfo } = useContext(UserContext);
    /** currently selected group name */
    const [group, setGroup] = useState<string>('');
    /** currently selected room name */
    const [room, setRoom] = useState<Room | undefined>();
    /** booking details / explanation */
    const [details, setDetails] = useState('');
    /** list of approvers */
    const [approvers, setApprovers] = useState<string[]>([]);
    /** currently selected list of dates */
    const [scheduleDates, setScheduleDates] = useState<Date[]>([]);
    /** whether the date is valid */
    const [validDate, setValidDate] = useState(false);
    /** whether the request was submitted */
    const [submitted, setSubmitted] = useState(false);
    /** whether the request is being submitted */
    const [submittedLoading, setSubmittedLoading] = useState(false);
    /** original edit booking object */
    const [originalBooking, setOriginalBooking] = useState<FetchedBookingRequest>();
    /** rules modal open */
    const [rulesOpen, setRulesOpen] = useState(false);

    /* set fill info if there is already an editID */
    useEffect(() => {
        if (editID) {
            (async () => {
                await axios
                    .get(`/requests/${editID}`)
                    .then((res) => {
                        if (res.status === 200) {
                            setGroup(
                                JSON.stringify({
                                    id: res.data.group.id,
                                    name: res.data.group.name,
                                } as Group),
                            );
                            if (res.data.roomName) {
                                setRoom(res.data.roomName);
                            }
                            if (res.data.description) {
                                setDetails(res.data.description);
                            }
                            if (res.data.approvers) {
                                setApprovers(res.data.approvers.map((approver: User) => approver.utorid));
                            }

                            // fill scheduled dates
                            if (res.data.startDate && res.data.endDate) {
                                const acc: Date[] = [];
                                const startTimeInMs = new Date(res.data.startDate).getTime();
                                const eventDuration =
                                    new Date(res.data.endDate).getTime() - new Date(res.data.startDate).getTime() + 1;
                                // 1 hr = (60 min / 1 hr) * (60 sec / 1 min) * (1000 ms / 1 sec) = 3600000 ms / hr
                                for (let i = 0; i < eventDuration; i += 3600000) {
                                    acc.push(new Date(startTimeInMs + i));
                                }
                                setScheduleDates(acc);
                            }
                            setOriginalBooking(res.data);
                        }
                    })
                    .catch(catchAxiosError('Could not fetch booking request', showSnackSev));
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editID]);

    /**
     * Checks if the date is not blocked
     * @property dates list of dates
     */
    const checkDate = async (dates: Date[]) => {
        await axios
            .get(`/rooms/${room!.roomName}/blockeddates`, {
                params: {
                    start_date: dates[0],
                    end_date: new Date(dates[dates.length - 1]),
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    let blockedDates: number[] = res.data
                        .filter((x: { status: BookingStatus; bookedRange: Date[] }) => x.status === 'completed')
                        .map((x: { status: BookingStatus; bookedRange: Date[] }) => x.bookedRange)
                        .flat()
                        .map((date: string) => new Date(date).getTime());

                    // remove dates that aren't blocked
                    if (originalBooking) {
                        blockedDates = blockedDates.filter((date: number) => {
                            return (
                                date <= new Date(originalBooking.startDate).getTime() ||
                                date >= new Date(originalBooking.endDate).getTime()
                            );
                        });
                    }

                    if (blockedDates.length > 0) {
                        setValidDate(false);
                        showSnackSev(
                            'This time overlaps with another booking, please choose a different time and/or date',
                            'error',
                        );
                        setScheduleDates([]);
                    } else {
                        setValidDate(true);
                    }
                } else {
                    setValidDate(false);
                    showSnackSev('An error occurred while checking the date, please try again', 'error');
                    setScheduleDates([]);
                }
            })
            .catch((err) => {
                setValidDate(false);
                catchAxiosError('An error occurred while checking the date', showSnackSev)(err);
                setScheduleDates([]);
            });
    };

    /**
     * Validate the booking request and submit if valid
     */
    const handleFinish = async () => {
        setSubmittedLoading(true);

        if (details === '') {
            showSnackSev('An explanation is required to submit', 'error');
            setSubmittedLoading(false);
            return;
        } else if (scheduleDates.length === 0) {
            showSnackSev('Please select a time', 'error');
            setSubmittedLoading(false);
            return;
        } else if (approvers.length === 0) {
            showSnackSev('Please select an approver', 'error');
            setSubmittedLoading(false);
            return;
        } else if (group === '') {
            showSnackSev('Please select a group', 'error');
            setSubmittedLoading(false);
            return;
        } else if (!room) {
            showSnackSev('Please select a room', 'error');
            setSubmittedLoading(false);
            return;
        }

        // await checkDate(scheduleDates).then(() => {
        //     if (!validDate) {
        //         setSubmittedLoading(false);
        //     }
        // });

        // compile into json object
        const booking = {
            roomName: room.roomName,
            groupId: (JSON.parse(group) as Group).id,
            description: details,
            title: details,
            startDate: scheduleDates[0],
            endDate: scheduleDates[scheduleDates.length - 1],
            approvers,
        };

        if (editID) {
            await axios
                .put(`/requests/${editID}`, booking)
                .then(() => {
                    setSubmitted(true);
                })
                .catch(catchAxiosError('Could not edit booking request', showSnackSev))
                .finally(() => {
                    setSubmittedLoading(false);
                });
        } else {
            await axios
                .post('/requests/create', booking)
                .then(() => {
                    setSubmitted(true);
                })
                .catch(catchAxiosError('Could not create booking request', showSnackSev))
                .finally(() => {
                    setSubmittedLoading(false);
                    fetchUserInfo();
                });
        }
    };

    /**
     * Validate the date in the DateTimePicker and clears ScheduleDates if invalid
     * @property dates list of dates
     */
    const handleScheduleDate = (dates: Date[]) => {
        /** used to check if all dates are on the same day */
        let currDate = 0;
        setValidDate(true);
        for (let i = 0; i < dates.length; i++) {
            // if in the past
            if (dates[i] < new Date()) {
                showSnackSev('Please select a date in the future', 'error');
                setValidDate(false);
                setScheduleDates([]);
                return;
            }

            // if not the same day
            if (dates[i].getDate() !== currDate && i > 0) {
                showSnackSev('Please only select one day', 'error');
                setValidDate(false);
                setScheduleDates([]);
                return;
            }
            currDate = dates[i].getDate();
        }

        if (dates.length > 0) {
            checkDate(dates);
        }

        const newDates = dates.map((date) => {
            return date;
        });

        setScheduleDates(newDates);
    };

    /*
     * case where booking was successful
     */
    if (submitted) {
        return (
            <BookingSubmitted
                details={details}
                scheduleDates={scheduleDates}
                groupName={(JSON.parse(group) as Group).name}
            />
        );
    }

    /*
     * case where user can create a booking
     */
    return (
        <TransitionGroup>
            {userInfo.groups.length > 0 && (
                <Collapse>
                    <Box
                        sx={{
                            marginBottom: '4em',
                            width: '100%',
                        }}
                    >
                        <Divider>Select the group to book under</Divider>

                        <GroupPicker setGroup={setGroup} group={group} />
                    </Box>
                </Collapse>
            )}

            {group && (
                <Collapse>
                    <Box
                        sx={{
                            marginBottom: '4em',
                            width: '100%',
                        }}
                    >
                        <Divider>Select the room to book</Divider>

                        <RoomPicker setRoom={setRoom} room={room} />
                        {room && room.roomRules && (
                            <>
                                <Typography>
                                    By booking this room, you agree to the{' '}
                                    <Link onClick={() => setRulesOpen(true)} href={'javascript:void(0);'}>
                                        Room Rules
                                    </Link>
                                </Typography>
                                <Modal open={rulesOpen} onClose={() => setRulesOpen(false)}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 400,
                                            bgcolor: 'background.paper',
                                            border: '2px solid #000',
                                            boxShadow: 24,
                                            p: 4,
                                        }}
                                    >
                                        <Typography variant="h6" component={'h2'}>
                                            Rules for {room.friendlyName} - {room.roomName}
                                        </Typography>
                                        <Typography variant="body1" component={'p'}>
                                            {room.roomRules}
                                        </Typography>
                                        <Link onClick={() => setRulesOpen(false)} href={'javascript:void(0);'}>
                                            Close
                                        </Link>
                                    </Box>
                                </Modal>
                            </>
                        )}
                    </Box>
                </Collapse>
            )}

            {group && room && (
                <Collapse>
                    <Box
                        sx={{
                            marginBottom: '4em',
                            width: '100%',
                        }}
                    >
                        <Divider>Provide an explanation</Divider>

                        <TextField
                            fullWidth
                            id="explanation-field"
                            label="Please provide an explanation"
                            minRows={4}
                            multiline
                            required
                            value={details}
                            onChange={(e) => {
                                setDetails(e.target.value);
                            }}
                            sx={{ marginTop: '1em' }}
                        />
                    </Box>
                </Collapse>
            )}

            {group && room && details !== '' && (
                <Collapse>
                    <Box
                        sx={{
                            marginBottom: '4em',
                            width: '100%',
                        }}
                    >
                        <Divider sx={{ marginBottom: '2em' }}>Choose Approvers to review your request</Divider>

                        <ApproverPicker
                            setApprovers={setApprovers}
                            selectedApprovers={approvers}
                            roomName={room.roomName}
                        />
                    </Box>
                </Collapse>
            )}

            {group && room && details !== '' && approvers.length > 0 && (
                <Collapse>
                    <Box
                        sx={{
                            marginBottom: '4em',
                            width: '100%',
                        }}
                    >
                        <Divider sx={{ marginBottom: '2em' }}>Select a date</Divider>

                        <DateTimePicker
                            handleScheduleDate={handleScheduleDate}
                            scheduleDates={scheduleDates}
                            setScheduleDates={setScheduleDates}
                            roomName={room.roomName}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={async () => {
                            await handleFinish();
                        }}
                        disabled={!validDate || scheduleDates.length <= 0 || submittedLoading}
                        endIcon={submittedLoading && <CircularProgress size={20} />}
                    >
                        Finish
                    </Button>
                </Collapse>
            )}
        </TransitionGroup>
    );
};

export const CreateBooking = () => {
    const { userInfo } = useContext(UserContext);

    if (userInfo.groups.length <= 0) {
        return (
            <ErrorPage
                name="Cannot create booking"
                message={
                    <>
                        Please <Link href="/group">create a group</Link> before making a booking request.
                    </>
                }
            />
        );
    }

    return (
        <SubPage name="Create a booking">
            <CreateModifyBooking />
        </SubPage>
    );
};
