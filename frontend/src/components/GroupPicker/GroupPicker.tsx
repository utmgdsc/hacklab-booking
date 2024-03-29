import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { useContext, useEffect } from 'react';

interface GroupPickerProps {
    /** a JSON stringify'd group object */
    group: string;
    /** a react useState hook that sets the group */
    setGroup: (group: string) => void;
}

/**
 * A component that allows the user to pick a group from a list of groups
 */
export const GroupPicker = ({ group, setGroup }: GroupPickerProps) => {
    /** user info */
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        if (userInfo.groups.length === 1) {
            setGroup(JSON.stringify({ id: userInfo.groups[0].id, name: userInfo.groups[0].name } as Group));
        }
    }, [userInfo.groups, setGroup]);

    return (
        <FormControl fullWidth sx={{ marginTop: '1em' }}>
            <InputLabel id="group-label">Group</InputLabel>
            <Select
                labelId="group-label"
                id="group-select"
                value={group}
                fullWidth
                label="Group"
                onChange={(e) => {
                    setGroup(e.target.value);
                }}
            >
                {userInfo.groups.map((group) => {
                    return (
                        <MenuItem
                            value={JSON.stringify({
                                id: group.id,
                                name: group.name,
                            } as Group)}
                            key={group.id}
                        >
                            {group.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
