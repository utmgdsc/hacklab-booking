import { useState, useEffect } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import axios from '../../axios';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface ApproverPickerProps {
    /** a function that takes in an array of approvers as utorids and sets the approvers for the form */
    setApprovers: (approvers: string[]) => void;
    /** the approvers that have already been selected as an array of utorids */
    selectedApprovers?: string[];
}

/**
 * A control that allows the user to select approvers from a list of all approvers.
 *
 * @param setApprovers a function that takes in an array of approvers and sets the approvers for the form
 */
export const ApproverPicker = ({ setApprovers, selectedApprovers = [] } : ApproverPickerProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(selectedApprovers);
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
