import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import { GroupCard, InputDialog } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { SubPage } from '../../layouts/SubPage';
import { UserContext } from '../../contexts/UserContext';
import { Done as DoneIcon, Close as CloseIcon } from '@mui/icons-material';

/**
 * Shows a group card with accept and decline buttons
 * @param group The group to display
 */
const InvitedGroupCard = ({ group }: { group: FetchedGroup }) => {
    const { fetchUserInfo } = useContext(UserContext);
    const { showSnackSev } = useContext(SnackbarContext);

    return (
        <Card variant="outlined" sx={{ margin: '1em 0' }}>
            <CardContent>
                <Typography variant="h3">{group.name}</Typography>
                <Typography variant="body1">
                    {group.members.length} member{group.members.length === 1 ? '' : 's'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    color="success"
                    startIcon={<DoneIcon />}
                    onClick={() => {
                        axios
                            .post(`/groups/${group.id}/invite/accept`)
                            .then(() => {
                                showSnackSev('You have joined the group', 'success');
                            })
                            .finally(() => {
                                fetchUserInfo();
                            });
                    }}
                >
                    Accept
                </Button>
                <Button
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => {
                        axios
                            .post(`/groups/${group.id}/invite/reject`)
                            .then(() => {
                                showSnackSev('You have declined the invitation', 'success');
                            })
                            .finally(() => {
                                fetchUserInfo();
                            });
                    }}
                >
                    Decline
                </Button>
            </CardActions>
        </Card>
    );
};

export const GroupDirectory = () => {
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** create group dialog open state */
    const [open, setOpen] = React.useState(false);
    /** the groups that the user is a member of */
    let [myGroups, setMyGroups] = useState<FetchedGroup[]>([]);
    /** user info object */
    const { userInfo } = useContext(UserContext);

    const sendAddGroup = async () => {
        const { data, status } = await axios.post('/groups/create', {
            name: (document.getElementById('group-name') as HTMLInputElement).value,
        });

        if (status === 200) {
            setMyGroups((array) => [...array, data]); // add to local list of groups
            showSnackSev('Group created successfully', 'success');
        } else {
            showSnackSev('Failed to create group', 'error');
        }
    };

    useEffect(() => {
        axios
            .get('/groups')
            .then((res) => {
                setMyGroups(res.data as FetchedGroup[]);
            })
            .catch((err) => {
                console.error(err);
                showSnackSev('Failed to fetch groups', 'error');
            });
    }, [userInfo.groups]);

    return (
        <SubPage name="Your Groups">
            {/* menu bar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1em',
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Create Group
                </Button>
                <InputDialog
                    title="Create Group"
                    label="Group Name"
                    open={open}
                    setOpen={setOpen}
                    onSubmit={sendAddGroup}
                    description="To create a new group, please enter the group name below. You will be the group administrator."
                />
            </Box>

            {userInfo.role === 'student' &&
                myGroups.map((group) => {
                    return <GroupCard key={group.id} groupObj={group} />;
                })}

            {userInfo.role !== 'student' && (
                <>
                    {myGroups
                        .filter((group) => {
                            const isMember = group.members.find((member) => member.utorid === userInfo.utorid);
                            const isManager = group.managers.find((manager) => manager.utorid === userInfo.utorid);

                            return isMember || isManager;
                        })
                        .map((group) => {
                            return <GroupCard key={group.id} groupObj={group} />;
                        })}
                    <Typography variant="h2" sx={{ margin: '2em 0 0.5em 0' }}>
                        All Groups
                    </Typography>
                    <Grid container spacing={2} sx={{ marginBottom: '1em' }}>
                        {myGroups.map((group) => {
                            return (
                                <Grid item xs={12} md={6} key={group.id}>
                                    <GroupCard groupObj={group} />
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            )}

            {userInfo.invited.length > 0 && (
                <>
                    <Typography variant="h2" sx={{ margin: '2em 0 0.5em 0' }}>
                        Your Invites
                    </Typography>
                    <Grid container spacing={2} sx={{ marginBottom: '1em' }}>
                        {userInfo.invited.map((group) => {
                            return (
                                <Grid item xs={12} sm={6} md={3} key={group.id}>
                                    <InvitedGroupCard group={group} />
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            )}
        </SubPage>
    );
};
