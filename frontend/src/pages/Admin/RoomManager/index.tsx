import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios, { catchAxiosError } from '../../../axios';
import { Link } from '../../../components';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { UserContext } from '../../../contexts/UserContext';
import { SubPage } from '../../../layouts/SubPage';
import { TransitionGroup } from 'react-transition-group';

export const RoomManager = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [updateValue, setUpdateValue] = useState<Number>();
    const { showSnackSev } = useContext(SnackbarContext);

    useEffect(() => {
        const getRooms = async () => {
            await axios
                .get('/rooms')
                .then((res) => {
                    if (res.status === 200) {
                        setRooms(res.data);
                    }
                })
                .catch(catchAxiosError(`Failed to get rooms`, showSnackSev));
        };

        void getRooms();
    }, [updateValue]);

    const getRooms = () => {
        setUpdateValue(Math.random);
    };

    return (
        <SubPage name="Room Manager" maxWidth="xl">
            <Button
                onClick={() => {
                    setCreateRoomOpen(true);
                }}
                sx={{ marginLeft: '1em', marginBottom: '1em' }}
            >
                Create Room
            </Button>
            <TransitionGroup>
                {rooms.map((room, index) => (
                    <Collapse key={index}>
                        <RoomCard {...room} />
                    </Collapse>
                ))}
            </TransitionGroup>
            <CreateRoomDialog open={createRoomOpen} setOpen={setCreateRoomOpen} getRooms={getRooms} />
        </SubPage>
    );
};

/**
 * Room Card component. Prop names align with the Room type in the backend
 * @param roomName name of the room
 * @param friendlyName friendly name of the room
 * @param capacity capacity of the room
 */
const RoomCard = ({ roomName, friendlyName, capacity }: Room) => {
    return (
        <Card variant="outlined" sx={{ maxWidth: 275, display: 'inline-block', mx: '1em' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {roomName} - {capacity} people capacity
                </Typography>
                <Typography variant="h5" component="div">
                    {friendlyName}
                </Typography>
            </CardContent>
            <CardActions>
                <Link href={`./${roomName}`}>
                    <Button size="small">Control Access</Button>
                </Link>
            </CardActions>
        </Card>
    );
};

/**
 * Dialog to create a room
 * @param open whether the dialog is open
 * @param setOpen function to set the open state
 * @param getRooms function to get the rooms which will be called after a room is created
 */
const CreateRoomDialog = ({
    open,
    setOpen,
    getRooms,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getRooms: () => void;
}) => {
    /** value of the input */
    const [friendlyName, setFriendlyName] = useState('');
    const [room, setRoomName] = useState('');
    const [capacity, setCapacity] = useState<number>();
    /** mui theme context */
    const theme = useTheme();
    /** if the dialog should be full screen */
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** user context */
    const { fetchUserInfo } = useContext(UserContext);

    const createRoom = async () => {
        if (!friendlyName || !room || !capacity) {
            if (capacity === 0) {
                showSnackSev('Capacity must be greater than 0', 'warning');
            } else {
                showSnackSev('Please fill out all fields', 'warning');
            }
            return;
        } else if (isNaN(capacity) || !Number.isInteger(capacity)) {
            showSnackSev('Capacity must be an integer', 'warning');
            return;
        } else {
            await axios
                .post('/rooms/create', {
                    friendlyName,
                    room,
                    capacity,
                })
                .then((res) => {
                    if (res.status === 200) {
                        showSnackSev('Room created successfully', 'success');
                        setOpen(false);
                        fetchUserInfo();
                    } else if (res.status === 400) {
                        showSnackSev('Room already exists', 'warning');
                    } else {
                        showSnackSev('Error creating room', 'error');
                        setOpen(false);
                    }
                })
                .catch(catchAxiosError('Error creating room', showSnackSev));
        }
        setOpen(false);
        setFriendlyName('');
        setRoomName('');
        setCapacity(0);
        getRooms();
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="add-room-title"
        >
            <DialogTitle id="add-room-title">Add a room</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter the details of the room you want to add.</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id={'friendly-name'}
                    label={'Friendly Name (e.g., "Hacklab")'}
                    type="text"
                    fullWidth
                    value={friendlyName}
                    onChange={(e) => setFriendlyName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id={'name'}
                    label={'Name (e.g., "DH2014")'}
                    type="text"
                    fullWidth
                    value={room}
                    // replaces all whitespace with nothing on submission
                    onChange={(e) => setRoomName(e.target.value.replace(/\s/g, ''))}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    inputProps={{
                        min: 0,
                    }}
                    id={'capacity'}
                    label={'Total Room Capacity (e.g., 24)'}
                    type="number"
                    fullWidth
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    margin: '1em',
                }}
            >
                <Button
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        createRoom();
                    }}
                    variant="contained"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};
