import { Inventory, People } from '@mui/icons-material';
import { Card, CardContent, Divider, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../axios';
import { convertDate, RoleChanger, UserCard } from '../../../components';
import { ErrorPage } from '../../../layouts/ErrorPage';
import { SubPage } from '../../../layouts/SubPage';

export const UserViewer = () => {
    const { id: utorid } = useParams();
    const [user, setUser] = useState<FetchedUser | undefined>();

    const fetchUser = async () => {
        await axios
            .get(`/accounts/${utorid}`)
            .then((res) => {
                if (res.status === 200) {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [utorid]);

    if (user === undefined) {
        return (
            <ErrorPage name="User not found" message={<>{`We could not find a user with the UTorID ${utorid}`}</>} />
        );
    }

    return (
        <SubPage name={`Details for ${utorid}`} maxWidth="xl">
            <UserCard userInfo={user} />

            <Grid container spacing={2} sx={{ my: '1em' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                Theme Preference
                            </Typography>
                            <Typography variant="h3">{user.theme}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                Role
                            </Typography>
                            <Typography variant="h3">{user.role}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                Change Role
                            </Typography>
                            <RoleChanger utorid={user.utorid} userRole={user.role} setUpdate={fetchUser} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h2" gutterBottom sx={{ marginTop: '1em' }}>
                Room Access
            </Typography>
            <Grid container spacing={2}>
                {user.roomAccess.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1">This user has no room access</Typography>
                    </Grid>
                ) : (
                    user.roomAccess.map((room) => (
                        <Grid item xs={12} sm={6} md={3} key={room.roomName}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>
                                        {room.roomName}
                                    </Typography>
                                    <Typography variant="h3">{room.friendlyName}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Typography variant="h2" gutterBottom sx={{ marginTop: '1em' }}>
                Requests
            </Typography>
            <Grid container spacing={2}>
                {user.requests.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1">This user has no requests</Typography>
                    </Grid>
                ) : (
                    user.requests.map((request) => (
                        <Grid item xs={12} sm={6} key={request.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Tooltip title="Request UUID">
                                        <Typography variant="gray" gutterBottom>
                                            <Inventory fontSize="small" /> {request.id}
                                        </Typography>
                                    </Tooltip>
                                    <br />
                                    <Tooltip title="Group UUID">
                                        <Typography variant="gray" gutterBottom>
                                            <People fontSize="small" /> {request.groupId}
                                        </Typography>
                                    </Tooltip>
                                    <br />
                                    <Tooltip title={`Last Updated ${request.updatedAt}`}>
                                        <Typography variant="gray" gutterBottom>
                                            Updated: {convertDate(request.updatedAt)}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Request Title">
                                        <Typography variant="h3">{request.title}</Typography>
                                    </Tooltip>
                                    <Tooltip title="Request Description">
                                        <Typography variant="body1">{request.description}</Typography>
                                    </Tooltip>
                                    <Tooltip title={`Start Date ${request.startDate}`}>
                                        <Typography variant="gray" gutterBottom>
                                            {convertDate(request.startDate)} -{' '}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title={`End Date ${request.endDate}`}>
                                        <Typography variant="gray" gutterBottom>
                                            {convertDate(request.endDate)}
                                        </Typography>
                                    </Tooltip>
                                    <Divider sx={{ my: '0.5em' }} />
                                    <Tooltip title="Request Approval Reason">
                                        <Typography variant="body1">{request.reason}</Typography>
                                    </Tooltip>
                                    <Tooltip title="Request Room Name">
                                        <Typography variant="gray">{request.roomName} - </Typography>
                                    </Tooltip>
                                    <Tooltip title="Current Request Status">
                                        <Typography variant="gray">{request.status}</Typography>
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Typography variant="h2" gutterBottom sx={{ marginTop: '1em' }}>
                Groups
            </Typography>
            <Grid container spacing={2}>
                {user.groups.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1">This user is not in any groups</Typography>
                    </Grid>
                ) : (
                    user.groups.map((group) => (
                        <Grid item xs={12} sm={6} key={group.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Tooltip title="Group UUID">
                                        <Typography variant="gray" gutterBottom>
                                            {group.id}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Group Name">
                                        <Typography variant="h3">{group.name}</Typography>
                                    </Tooltip>
                                    {user.manager.filter((manager) => manager.id === group.id).length === 0 ? (
                                        <Typography variant="body1">User is not a manager</Typography>
                                    ) : (
                                        <Typography variant="body1">User is a manager</Typography>
                                    )}
                                    <Typography variant="body1">{group.members.length} member(s)</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Typography variant="h2" gutterBottom sx={{ marginTop: '1em' }}>
                Groups invited to
            </Typography>
            <Grid container spacing={2}>
                {user.invited.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1">This user is not invited to any groups</Typography>
                    </Grid>
                ) : (
                    user.invited.map((group) => (
                        <Grid item xs={12} sm={6} key={group.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Tooltip title="Group UUID">
                                        <Typography variant="gray" gutterBottom>
                                            {group.id}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Group Name">
                                        <Typography variant="h3">{group.name}</Typography>
                                    </Tooltip>
                                    <Typography variant="body1">{group.members.length} member(s)</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </SubPage>
    );
};
