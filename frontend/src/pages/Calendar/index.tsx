import React from 'react';
import { useTheme } from '@mui/material';
import { SubPage } from '../../layouts/SubPage';
import { THEME } from '../../theme/theme';

export const Calendar = () => {
    let theme = useTheme();

    return (
        <SubPage name="Hacklab Calendar">
            <iframe
                src="https://calendar.google.com/calendar/embed?src=hacklabbooking%40gmail.com&ctz=America%2FToronto"
                style={{
                    width: '100%',
                    height: '75vh',
                    border: '0',
                    filter: theme.palette.mode === THEME.DARK ? 'invert(1)hue-rotate(180deg)' : null,
                }}
                title="Hacklab Calendar"
            ></iframe>
        </SubPage>
    );
};
