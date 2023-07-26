import { Person } from '@mui/icons-material';
import {
    Card,
    CardContent,
    FormControl,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { FocusEvent, useContext, useEffect, useState } from 'react';
import axios from '../../../axios';
import { SelectWebhookType } from '../../../components/Webhooks/SelectWebhookType';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { UserContext } from '../../../contexts/UserContext';
import { SubPage } from '../../../layouts/SubPage';

const webhookTypes = ['slack', 'discord', 'email'] as Readonly<string[]>;

const webhookEvents: Record<
    string,
    {
        name: string;
        description: string;
        admin?: boolean;
    }
> = {
    ADMIN_BOOKING_CREATED: {
        name: 'Booking Created',
        description: 'When a user creates a booking',
    },
    BOOKING_APPROVAL_REQUESTED: {
        name: 'Booking Approval Requested',
        description: 'When a user requests your approval for a booking',
        admin: true,
    },
    ADMIN_BOOKING_UPDATED: {
        name: 'Booking Updated',
        description: 'When a booking is updated',
    },
    BOOKING_STATUS_CHANGED: {
        name: 'Booking Status Changed',
        description: "When your booking's status is changed",
    },
    ADMIN_BOOKING_STATUS_CHANGED: {
        name: 'Booking Status Changed (Admin)',
        description: "When a booking's status is changed",
    },
    ROOM_ACCESS_GRANTED: {
        name: 'Room Access Granted',
        description: 'When you are granted access to a room',
    },
    ADMIN_ROOM_ACCESS_GRANTED: {
        name: 'Room Access Granted (Admin)',
        description: 'When a user is granted access to a room by an admin',
    },
    ROOM_ACCESS_REVOKED: {
        name: 'Room Access Revoked',
        description: 'When your access to a room is revoked',
    },
    ADMIN_ROOM_ACCESS_REVOKED: {
        name: 'Room Access Revoked (Admin)',
        description: "When a user's access to a room is revoked by an admin",
    },
    GROUP_MEMBER_INVITED: {
        name: 'Group Member Invited',
        description: 'When a user invites another member to a group your manage',
    },
    USER_INVITED_TO_GROUP: {
        name: 'User Invited to Group',
        description: 'When you are invited to a group',
    },
    GROUP_MEMBER_JOINED: {
        name: 'Group Member Joined',
        description: 'When a user joins a group you are in',
    },
    GROUP_MEMBER_REMOVED: {
        name: 'Group Member Removed',
        description: 'When a user is removed from a group you manage',
    },
    GROUP_MEMBER_LEFT: {
        name: 'Group Member Left',
        description: 'When a user leaves a group you are in',
    },
};
export const Webhooks = () => {
    const { userInfo, fetchUserInfo } = useContext(UserContext);
    const { showSnackSev } = useContext(SnackbarContext);
    const [slackWebhook, setSlackWebhook] = useState(userInfo.slackWebhook);
    const [discordWebhook, setDiscordWebhook] = useState(userInfo.discordWebhook);
    const isAdmin = userInfo.role !== 'student';
    useEffect(() => {
        setSlackWebhook(userInfo.slackWebhook);
        setDiscordWebhook(userInfo.discordWebhook);
    }, [userInfo]);
    const updateWebhook = (type: 'slack' | 'discord') => {
        return async (e: FocusEvent<HTMLInputElement>) => {
            if (e.target.value === (type === 'slack' ? userInfo.slackWebhook : userInfo.discordWebhook)) {
                return;
            }
            const { status } = await axios.put('accounts/webhooks/' + type, { webhook: e.target.value ?? null });
            if (status === 200) {
                await fetchUserInfo();
                showSnackSev('Webhook updated!', 'success');
            }
        };
    };
    const handleTypeChange = (webhookEvent: string) => {
        return async (value: string[] | string) => {
            const newWebhooks: Record<string, string[]> = { ...userInfo.webhooks };
            newWebhooks[webhookEvent] = typeof value === 'string' ? value.split(',') : (value as string[]);
            const { status } = await axios.put('accounts/webhooks/', { webhooks: newWebhooks });
            if (status === 200) {
                await fetchUserInfo();
                showSnackSev('Webhook updated!', 'success');
            }
        };
    };

    Object.keys(webhookEvents).forEach((webhookEvent) => {
        if (!userInfo.webhooks[webhookEvent]) {
            userInfo.webhooks[webhookEvent] = [];
        }
    });

    return (
        <SubPage name="Manage Webhooks" maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h2" gutterBottom>
                                <Person /> Notification Destinations
                            </Typography>
                            <Typography variant="gray" sx={{ display: 'block' }}>
                                Leave empty to disable
                            </Typography>

                            <FormControl
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '1em',
                                    marginTop: '2em',
                                }}
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <TextField
                                    placeholder="Your Email"
                                    variant="filled"
                                    label="Email"
                                    fullWidth
                                    value={userInfo.email}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    placeholder="https://discord.com/api/webhooks/XXXXXXXXXXXXXXXXXXX/XXXXXXXXX_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                                    variant="filled"
                                    label="Discord Webhook"
                                    fullWidth
                                    value={discordWebhook ?? ''}
                                    onChange={(e) => setDiscordWebhook(e.target.value)}
                                    size="small"
                                    onBlur={updateWebhook('discord')}
                                />
                                <TextField
                                    placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                                    variant="filled"
                                    label="Slack Webhook"
                                    fullWidth
                                    value={slackWebhook ?? ''}
                                    onChange={(e) => setSlackWebhook(e.target.value)}
                                    size="small"
                                    onBlur={updateWebhook('slack')}
                                />
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card variant="outlined">
                        <CardContent>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Event</TableCell>
                                            <TableCell align="right">Destinations</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(webhookEvents)
                                            .filter(
                                                (event) =>
                                                    isAdmin ||
                                                    !(webhookEvents[event].admin || event.startsWith('ADMIN')),
                                            )
                                            .map((event) => {
                                                return (
                                                    <TableRow
                                                        key={event}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {webhookEvents[event].name}
                                                            <br />
                                                            <Typography variant="gray" sx={{ display: 'block' }}>
                                                                {webhookEvents[event].description}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <SelectWebhookType
                                                                onClose={handleTypeChange(event)}
                                                                webhookTypes={webhookTypes}
                                                                values={userInfo.webhooks[event]}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </SubPage>
    );
};
