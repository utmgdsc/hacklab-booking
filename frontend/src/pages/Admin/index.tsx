import { Inventory, MeetingRoom } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Paper,
    TableCell,
    Tooltip,
    Typography,
    useTheme,
    TableRow,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { AppButtons, VirtuosoTableComponents, RoleChanger } from '../../components';
import { UserContext } from '../../contexts/UserContext';
import { SubPage } from '../../layouts/SubPage';



export const Admin = () => {
    const { userInfo } = useContext(UserContext);
    const [filterApproval, setFilterApproval] = useState(false);
    const [rowsToDisplay, setRowsToDisplay] = useState(null);
    const [rows, setRows] = useState(null);
    const [update, setUpdate] = useState(0);

    const theme = useTheme();

    const adminAppButtons = [
        {
            title: 'View a list of all booking requests',
            href: '/admin/all-requests',
            icon: <Inventory />,
            label: 'All Requests',
            color: theme.palette.app_colors.red,
        },
        {
            title: 'Create and view information on rooms',
            href: '/admin/room-manager',
            icon: <MeetingRoom />,
            label: 'Manage Rooms',
            color: theme.palette.app_colors.green,
        },
    ];

    return (
        <SubPage name="Admin" maxWidth="xl">
            <AppButtons ButtonsToRender={adminAppButtons} />
        </SubPage>
    );
};
