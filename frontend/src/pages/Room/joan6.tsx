import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import SparkleMascot from '../../assets/img/sparkle-mascot.png';
import axios from '../../axios';

const EventsRow = ({ events }: { events: BookingRequest[] }) => {
    return (
        <>
            {events.map((event) => {
                return <>{JSON.stringify(event)}</>;
            })}
        </>
    );
};

export const Joan6 = () => {
    const [CurrentDateTime, setCurrentDateTime] = useState('...');
    const [room, setRoomData] = useState<FetchedRoom>({
        capacity: 0,
        friendlyName: '',
        requests: [],
        roomName: '',
        userAccess: [],
    });
    const [currentEvents, setCurrentEvents] = useState<BookingRequest[]>([]);
    const { showSnackSev } = useContext(SnackbarContext);
    const { id: roomId } = useParams();
    const [currentBooking, setCurrentBooking] = useState<BookingRequest | null>(null);
    const [nextFree, setNextFree] = useState<String | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(
                new Date().toLocaleString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
            );
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        axios
            .get(`/rooms/${roomId}`)
            .then(({ data }) => {
                console.log(data);
                setRoomData(data);
                setCurrentEvents(
                    room.requests.filter((request) => {
                        // check if request is today
                        if (request.startDate.getDate() !== new Date().getDate()) return false;
                        if (request.startDate.getMonth() !== new Date().getMonth()) return false;

                        // check if request is completed
                        return request.status === 'completed';
                    }),
                );
            })
            .catch((err) => {
                showSnackSev('Room not found', 'error');
                console.error(err);
            });

        // get current events
        if (currentEvents.length !== 0) {
            const currentTime = new Date();
            // check if current time is in between any of the events

            const currentEvent = (): BookingRequest =>
                currentEvents.find((event) => {
                    return event.startDate < currentTime && currentTime < event.endDate;
                });

            if (currentEvent) {
                setCurrentBooking(currentEvent());
            }

            // get next time the room is free by incrementing the current time until it is not in between any of the events
            while (currentTime.getHours() < 23) {
                currentTime.setHours(currentTime.getHours() + 1);
                if (!currentEvent()) {
                    // found a time when the room is free
                    setNextFree(
                        `Will be free at ${currentTime.toLocaleTimeString(undefined, {
                            hour: 'numeric',
                        })}`,
                    );
                    break;
                }
            }
        }
    }, [roomId, CurrentDateTime]);
    return (
        <Grid container>
            <Grid item xs={7}>
                <Box sx={{ height: '100vh' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            padding: '2em',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="gray" sx={{ fontSize: '1.25em' }}>
                                {room.friendlyName} • {room.roomName}
                            </Typography>
                            <Typography variant="gray" sx={{ fontSize: '1.25em' }}>
                                {CurrentDateTime}
                            </Typography>
                        </Box>
                        {currentBooking && (
                            <Box>
                                <Typography variant="h3" component="p" sx={{ fontWeight: 400, opacity: 0.5 }}>
                                    Booked by {currentBooking.groupId}
                                </Typography>
                                <Typography variant="h1" sx={{ fontSize: '4em', fontWeight: 700 }}>
                                    {currentBooking.title}
                                </Typography>
                                <Typography variant="h2" sx={{ fontWeight: 400 }}>
                                    {currentBooking.startDate.toLocaleTimeString(undefined, {
                                        hour: 'numeric',
                                    })}{' '}
                                    -
                                    {currentBooking.endDate.toLocaleTimeString(undefined, {
                                        hour: 'numeric',
                                    })}
                                </Typography>
                                <Typography variant="gray" sx={{ fontSize: '1.15em' }}>
                                    {currentBooking.description}
                                </Typography>
                            </Box>
                        )}
                        {!currentBooking && (
                            <Box>
                                <img
                                    src={SparkleMascot}
                                    alt="The room is free at the moment"
                                    style={{
                                        maxWidth: '40vw',
                                    }}
                                />
                            </Box>
                        )}
                        <Box>
                            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4em' }} component="h2">
                                {currentBooking ? 'Busy' : 'Free'}
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 400, opacity: 0.5 }}>
                                {currentBooking ? nextFree : 'The room is not currently booked'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={5}>
                <Box sx={{ background: 'rgba(0,0,0,0.041)', height: '100vh' }}>
                    <EventsRow events={currentEvents} />
                </Box>
            </Grid>
        </Grid>
    );
};
