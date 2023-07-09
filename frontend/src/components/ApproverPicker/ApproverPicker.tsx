import { useState, useEffect } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import axios from '../../axios';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

export const ApproverPicker = ({ setApprovers }: { setApprovers: (approvers: string[]) => void }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [approvers, setApproversBackend] = useState([]);
    useEffect(() => {
        axios.get('/accounts/approvers').then(({ data }) => {
            setApproversBackend(data);
        });
    }, []);

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
