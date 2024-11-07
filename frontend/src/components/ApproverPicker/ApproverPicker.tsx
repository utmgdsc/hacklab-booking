import { useState, useEffect, useContext, useMemo } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import axios from '../../axios';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { UserContext } from '../../contexts/UserContext';

interface ApproverPickerProps {
    /** a function that takes in an array of approvers as utorids and sets the approvers for the form */
    setApprovers: (approvers: string[]) => void;
    /** the approvers that have already been selected as an array of utorids */
    selectedApprovers?: string[];
    /** the room that the user is booking */
    roomName: string;
}

/**
 * A control that allows the user to select approvers from a list of all approvers.
 */
export const ApproverPicker = ({ setApprovers, selectedApprovers = [], roomName }: ApproverPickerProps) => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(selectedApprovers);
    /** an array of all the approvers that can be chosen */
    const [approvers, setApproversBackend] = useState<User[]>([]);

    const needApprover = useMemo(
        () => !approvers.some((approver) => approver.utorid === userInfo.utorid),
        [approvers, userInfo.utorid],
    );

    useEffect(() => {
        (async () => {
            await axios
                .get('/rooms/' + roomName)
                .then(({ data }) => {
                    if (data.approvers) {
                        setApproversBackend(data.approvers);
                        if (!needApprover) {
                            setSelected([userInfo.utorid]);
                            setApprovers([userInfo.utorid]);
                        } else if (data.approvers.length === 1 && selectedApprovers.length === 0) {
                            setSelected([data.approvers[0].utorid]);
                            setApprovers([data.approvers[0].utorid]);
                        }
                    } else {
                        console.error('No approvers found for room ' + roomName + '.', data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        })();
    }, [roomName]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (event: SelectChangeEvent<string[]>) => {
        setSelected(event.target.value as string[]);
        setApprovers(event.target.value as string[]);
    };

    return (
        <Select
            disabled={!needApprover}
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={selected}
            onChange={handleSelect}
            multiple
            fullWidth
            renderValue={(selected) => {
                if (selected.length === 0) {
                    return 'Select Approvers';
                } else if (selected.length === approvers.length) {
                    return 'All Approvers';
                } else {
                    return selected.join(', ');
                }
            }}
        >
            {approvers.map((approver) => (
                <MenuItem key={approver.utorid} value={approver.utorid}>
                    <Checkbox checked={selected.indexOf(approver.utorid) > -1} />
                    <ListItemText primary={approver.name} />
                </MenuItem>
            ))}
        </Select>
    );
};
