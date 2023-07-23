import { Box, Button, Divider, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import { ApproverPicker, BookingSubmitted, DateTimePicker, GroupPicker, Link, RoomPicker } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { UserContext } from '../../contexts/UserContext';
import { ErrorPage } from '../../layouts/ErrorPage';
import { SubPage } from '../../layouts/SubPage';

/**
 * Edit a booking given a UUID or create a new booking if no UUID is given
 */
export const CreateModifyBooking = ({ editID }: { editID?: string }) => {
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** user info */
    const { userInfo } = useContext(UserContext);
    /** currently selected group name */
    const [group, setGroup] = useState<string>('');
    /** currently selected room name */
    const [roomName, setRoomName] = useState<string>('');
    /** booking details / explanation */
    const [details, setDetails] = useState('');
    /** list of approvers */
    const [approvers, setApprovers] = useState([]);
    /** currently selected list of dates */
    const [scheduleDates, setScheduleDates] = useState([]);
    /** whether the date is valid */
    const [validDate, setValidDate] = useState(false);
    /** whether the request was submitted */
    const [submitted, setSubmitted] = useState(false);

    /* set fill info if there is already an editID */
    useEffect(() => {
        if (editID) {
            axios.get(`/requests/${editID}`).then((res) => {
                if (res.status === 200) {
                    setGroup(
                        JSON.stringify({
                            id: res.data.group.id,
                            name: res.data.group.name,
                        } as Group),
                    );
                    setRoomName(res.data.roomName);
                    setDetails(res.data.description);
                    setApprovers(res.data.approvers.map((approver: User) => approver.utorid));
                }
            });
        }
    }, [editID]);

    /**
     * Checks if the date is not blocked
     * @param dates list of dates
     */
    const checkDate = async (dates: Date[]) => {
        axios
            .get(`/rooms/${roomName}/blockeddates`, {
                params: {
                    start_date: dates[0],
                    end_date: dates[dates.length - 1],
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.length > 0) {
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
            });
    };

    /**
     * Validate the booking request and submit if valid
     */
    const handleFinish = async () => {
        let finish = true;

        if (details === '') {
            showSnackSev('An explanation is required to submit', 'error');
            finish = false;
        }

        if (scheduleDates.length === 0) {
            showSnackSev('Please select a time', 'error');
            finish = false;
        }

        if (approvers.length === 0) {
            showSnackSev('Please select an approver', 'error');
            finish = false;
        }

        if (group === '') {
            showSnackSev('Please select a group', 'error');
            finish = false;
        }

        if (roomName === '') {
            showSnackSev('Please select a room', 'error');
            finish = false;
        }

        await checkDate(scheduleDates).then(() => {
            if (!validDate) {
                finish = false;
            }
        });

        if (!finish) {
            return;
        }

        // compile into json object
        const booking = {
            roomName,
            owner: userInfo['utorid'],
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
                .then((res) => {
                    setSubmitted(true);
                })
                .catch((err) => {
                    showSnackSev('Could not edit booking request', 'error');
                });
        } else {
            await axios
                .post('/requests/create', booking)
                .then((res) => {
                    setSubmitted(true);
                })
                .catch((err) => {
                    showSnackSev('Could not create booking request', 'error');
                });
        }
    };

    /**
     * Validate the date in the DateTimePicker and clears ScheduleDates if invalid
     * @param dates list of dates
     */
    const handleScheduleDate = (dates: Date[]) => {
        /** used to check if all dates are on the same day */
        let currDate = 0;

        for (let i = 0; i < dates.length; i++) {
            // if in the past
            if (dates[i] < new Date()) {
                showSnackSev('Please select a date in the future', 'error');
                setScheduleDates([]);
                return;
            }

            // if not the same day
            if (dates[i].getDate() !== currDate && i > 0) {
                showSnackSev('Please only select one day', 'error');
                setScheduleDates([]);
                return;
            }
            currDate = dates[i].getDate();
        }

        setValidDate(true);

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
        <>
            {userInfo.groups.length > 0 && (
                <Box
                    sx={{
                        marginBottom: '4em',
                        width: '100%',
                    }}
                >
                    <Divider>Select the group to book under</Divider>

                    <GroupPicker setGroup={setGroup} group={group} />
                </Box>
            )}

            {group && (
                <Box
                    sx={{
                        marginBottom: '4em',
                        width: '100%',
                    }}
                >
                    <Divider>Select the room to book</Divider>

                    <RoomPicker setRoomName={setRoomName} roomName={roomName} />
                </Box>
            )}

            {group && roomName && (
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
            )}

            {group && roomName && details !== '' && (
                <Box
                    sx={{
                        marginBottom: '4em',
                        width: '100%',
                    }}
                >
                    <Divider sx={{ marginBottom: '2em' }}>Choose Approvers to review your request</Divider>

                    <ApproverPicker setApprovers={setApprovers} selectedApprovers={approvers} roomName={roomName} />
                </Box>
            )}

            {group && roomName && details !== '' && approvers.length > 0 && (
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
                        room={roomName}
                    />
                </Box>
            )}

            {group && roomName && details !== '' && approvers.length > 0 && (
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        handleFinish();
                    }}
                    disabled={!validDate || scheduleDates.length <= 0}
                >
                    Finish
                </Button>
            )}
        </>
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
                        Please{' '}
                        <Link internal href="/group">
                            create a group
                        </Link>{' '}
                        before making a booking request.
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
