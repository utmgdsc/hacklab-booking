import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../../axios';
import { useState, useEffect } from 'react';

interface RoomPickerProps {
    /** the name of the room */
    roomName: string;
    /** a react useState hook that sets the room name */
    setRoomName: (roomName: string) => void;
}

/**
 * A component that allows the user to pick a room from a list of rooms
 */
export const RoomPicker = ({ roomName, setRoomName }: RoomPickerProps) => {
    /** list of rooms */
    const [rooms, setRooms] = useState<Room[]>([]);

    // get list of rooms
    useEffect(() => {
        (async () => {
            await axios
                .get<Room[]>('/rooms')
                .then((res) => {
                    setRooms(res.data);
                    if (res.data.length === 1) {
                        setRoomName(res.data[0].roomName);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        })();
    }, [setRoomName]);

    return (
        <FormControl fullWidth sx={{ marginTop: '1em' }}>
            <InputLabel id="room-label">Room</InputLabel>
            <Select
                labelId="room-label"
                id="room-select"
                value={roomName}
                fullWidth
                label="Room"
                onChange={(e) => {
                    setRoomName(e.target.value);
                }}
            >
                {rooms.map((room) => {
                    return (
                        <MenuItem value={room.roomName} key={room.roomName}>
                            {room.roomName} - {room.friendlyName}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
