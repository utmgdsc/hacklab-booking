import { Card, Box, Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import SparkleMascot from '../../assets/img/sparkle-mascot.png';
import SparkleMascotDark from '../../assets/img/sparkle-mascot_dark.png';
import axios from '../../axios';
import { formatRangedTime } from '../../components';
import { THEME } from '../../theme/theme';

/** set starting time starting with 0=12am */
const startHour: number = 8;
/** set number of hours to show */
const hoursToShow: number = 14;
/** set padding top and bottom */
const padding: string = '2em';
/** set height of 100% */
const fullHeight: string = `calc(100vh - ${padding})`;

/**
 * Displays a row of events for one day.
 * Precondition: events is sorted by start date starting with the earliest event
 * @property {BookingRequest[]} events a list of events to display
 */
const EventsRow = ({ events }: { events: BookingRequest[] }) => {
    /** mui theme object */
    const theme = useTheme();
    /** current time */
    const now: Date = new Date();

    return (
        <Box
            sx={{
                py: padding,
                paddingLeft: '4em',
            }}
        >
            <Box aria-hidden="true" height="0px">
                {[...Array(hoursToShow)].map((_e, i) => (
                    <Box
                        key={i}
                        sx={{
                            height: `calc(${fullHeight} / ${hoursToShow})`,
                            borderTop: `${theme.palette.text.disabled} 1px solid`,
                            width: '100%',
                            '&:before': {
                                content: `"${(i + startHour) % 12 ? (i + startHour) % 12 : 12} ${i < 12 - startHour ? 'AM' : 'PM'
                                    }"`,
                                display: 'block',
                                position: 'absolute',
                                marginLeft: '-3.1415em',
                                marginTop: '-0.69420em',
                            },
                        }}
                    ></Box>
                ))}

                {/* current time indicator */}
                <Box
                    sx={{
                        // (height of one hour * (current time - startHour)) + padding top
                        top: `
                            calc(
                                    (
                                        calc(${fullHeight} / ${hoursToShow})
                                        * ${now.getHours() - startHour}${(now.getMinutes() / 60).toString().slice(1)}
                                    )
                                + ${padding}
                            )
                        `,
                        borderTop: `${theme.palette.app_colors.red} 2px solid`,
                        borderBottom: `${theme.palette.app_colors.red} 2px solid`,
                        position: 'fixed',
                        width: '100%',
                        zIndex: 69,
                        ':before': {
                            content: `"${now.toLocaleTimeString(undefined, {
                                hour: 'numeric',
                            })}"`,
                            background: theme.palette.app_colors.red,
                            borderRadius: '50%',
                            display: 'block',
                            fontSize: '0',
                            height: '1rem',
                            marginLeft: '-0.75rem',
                            marginTop: '-0.5rem',
                            position: 'absolute',
                            width: '1rem',
                        },
                    }}
                ></Box>
            </Box>
            {events.map((event, index) => {
                const eventDuration = new Date(event.endDate).getHours() - new Date(event.startDate).getHours() + 1;
                const timeSinceLast = () => {
                    if (index === 0) return Math.abs(new Date(event.startDate).getHours() - startHour);
                    return Math.abs(
                        new Date(events[index - 1].endDate).getHours() + 1 - new Date(event.startDate).getHours(),
                    );
                };

                return (
                    <Card
                        key={event.id}
                        sx={{
                            padding: '1em', // internal padding
                            height: `calc((${fullHeight} / ${hoursToShow}) * ${eventDuration})`,
                            mx: '1em',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginTop: `calc(${fullHeight} / ${hoursToShow} * ${timeSinceLast()})`,
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="p"
                            sx={{
                                fontSize: `${eventDuration > 2 ? 2 : 1}em`,
                                fontWeight: 400,
                                opacity: 0.5,
                            }}
                        >
                            {event.group.name} •{' ' + formatRangedTime(event.startDate, event.endDate)}
                        </Typography>
                        <Typography
                            variant="h1"
                            component="p"
                            sx={{
                                fontSize: `${eventDuration > 2 ? 4 : 2}em`,
                                fontWeight: 700,
                            }}
                        >
                            {event.title}
                        </Typography>
                    </Card>
                );
            })}
        </Box>
    );
};

export const Joan6 = () => {
    const [CurrentDateTime, setCurrentDateTime] = useState('Loading ...');
    const [room, setRoomData] = useState<FetchedRoom>({
        approvers: [],
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
    const theme = useTheme();

    const update = useCallback(async () => {
        // make sure loading wheel isn't shown
        await axios
            .get(`/rooms/${roomId}`, {
                skipLoadingWheel: true,
            })
            .then(({ data }) => {
                setRoomData(data);
                setCurrentEvents(
                    room.requests
                        .filter((request) => {
                            // check if request is today
                            if (new Date(request.startDate).getDate() !== new Date().getDate()) return false;
                            if (new Date(request.startDate).getMonth() !== new Date().getMonth()) return false;
                            if (new Date(request.startDate).getFullYear() !== new Date().getFullYear()) return false;

                            // check if request is completed
                            return request.status === 'completed';
                        })
                        .sort((a, b) => {
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                        }),
                );
            })
            .catch((err) => {
                showSnackSev('Room not found', 'error');
                console.error(err);
            });

        // get current events
        if (currentEvents && currentEvents.length > 0) {
            const currentTime = new Date();
            // check if current time is in between any of the events
            const currentEvent: BookingRequest | undefined =
                currentEvents.find((event) => {
                    // 3600000 is 1 hr * 60 min * 60 sec * 1000 ms
                    // offset added to end date to account for the fact that the end date is not inclusive
                    return (
                        new Date(event.startDate) < currentTime &&
                        currentTime < new Date(new Date(event.endDate).getTime() + 3600000)
                    );
                });

            if (currentEvent) {
                setCurrentBooking(currentEvent);
            }

            // get next time the room is free by incrementing the current time until it is not in between any of the events
            while (currentTime.getHours() < 23) {
                currentTime.setHours(currentTime.getHours() + 1);
                if (!currentEvent) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentEvents, room.requests, roomId]);

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
            update();
        }, 1000);
        return () => clearInterval(interval);
    }, [update]);

    return (
        <Grid
            container
            sx={{
                overflow: 'hidden',
            }}
        >
            <Grid item xs={7}>
                <Box sx={{ height: '100vh' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            padding: padding,
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
                                    Booked by {currentBooking.group.name}
                                </Typography>
                                <Typography variant="h1" sx={{ fontSize: '4em', fontWeight: 700 }}>
                                    {currentBooking.title}
                                </Typography>
                                <Typography variant="h2" sx={{ fontWeight: 400 }}>
                                    {formatRangedTime(currentBooking.startDate, currentBooking.endDate)}
                                </Typography>
                                <Typography variant="gray" sx={{ fontSize: '1.15em' }}>
                                    {currentBooking.description}
                                </Typography>
                            </Box>
                        )}
                        {!currentBooking && (
                            <Box>
                                <img
                                    src={theme.palette.mode === THEME.DARK ? SparkleMascotDark : SparkleMascot}
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
