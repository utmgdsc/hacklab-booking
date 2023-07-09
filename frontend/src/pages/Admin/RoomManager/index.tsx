import { SubPage } from '../../../layouts/SubPage';
import { instance } from '../../../axios';
import { useContext, useEffect, useState } from 'react';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
    Button,
    Card,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    useTheme,
    useMediaQuery,
    CardContent,
    Typography,
    CardActions,
} from '@mui/material';
import { UserContext } from '../../../contexts/UserContext';

export const RoomManager = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const { showSnack } = useContext(SnackbarContext);

    const getRooms = async () => {
        instance.get('/rooms').then((res) => {
            if (res.status === 200) {
                setRooms(res.data);
            }
        });
    };

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <SubPage name="Room Manager" maxWidth="xl">
            <Button
                onClick={() => {
                    setCreateRoomOpen(true);
                }}
                sx={{ marginLeft: '1em' }}
            >
                Create Room
            </Button>
            <div>
                {rooms.map((room) => (
                    <RoomCard {...room} />
                ))}
            </div>
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
        <Card sx={{ maxWidth: 275, display: 'inline-block', mx: '1em' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {roomName} - {capacity} people capacity
                </Typography>
                <Typography variant="h5" component="div">
                    {friendlyName}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
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
            const { status } = await instance.post('/rooms/create', {
                friendlyName,
                room,
                capacity,
            });
            if (status === 200) {
                showSnackSev('Room created successfully', 'success');
                setOpen(false);
                fetchUserInfo();
            } else {
                showSnackSev('Error creating room', 'error');
                setOpen(false);
            }
        }
        setOpen(false);
        createRoom();
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
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
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
