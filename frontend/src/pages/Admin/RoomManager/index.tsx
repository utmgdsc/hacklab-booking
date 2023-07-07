import { SubPage } from '../../../layouts/SubPage';
import { instance } from '../../../axios';
import { useContext, useEffect, useState } from 'react';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { Button, Alert } from '@mui/material';

export const RoomManager = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    const { showSnack } = useContext(SnackbarContext);

    useEffect(() => {
        instance.get('/rooms').then((res) => {
            if (res.status === 200) {
                setRooms(res.data);
            }
        });
    }, []);

    return (
        <SubPage name="Room Manager" maxWidth="xl">
            <Button
                onClick={() => {
                    showSnack('Room created');
                }}
            >
                Create Room
            </Button>
            <Button
                onClick={() => {
                    showSnack(null, null, <Alert>Hello</Alert>);
                    showSnack(null, null, <Alert severity="error">Goodbye</Alert>);
                }}
            >
                Create Room
            </Button>
            <div>
                {rooms.map((room) => (
                    <div key={room.friendlyName}>{room.friendlyName}</div>
                ))}
            </div>
        </SubPage>
    );
};
