import { Checkbox, ListItemText, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

export const SelectWebhookType = ({
    onClose,
    webhookTypes,
    values,
}: {
    onClose: (value: string[]) => void;
    webhookTypes: Readonly<string[]>;
    values: string[];
}) => {
    const [selected, setSelected] = useState(values);
    useEffect(() => {
        setSelected(values);
    }, [values]);
    return (
        <Select
            multiple
            value={selected}
            renderValue={(selected) => selected.join(', ')}
            onChange={(e) => {
                setSelected(e.target.value as string[]);
            }}
            onClose={() => onClose(selected)}
        >
            {webhookTypes.map((type) => (
                <MenuItem key={type} value={type}>
                    <Checkbox checked={(selected as string[]).includes(type)} />
                    <ListItemText primary={type} />
                </MenuItem>
            ))}
        </Select>
    );
};
