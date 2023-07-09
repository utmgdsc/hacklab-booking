import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import { ConfirmationDialog, InitialsAvatar, InputDialog } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { UserContext } from '../../contexts/UserContext';
import { SubPage } from '../../layouts/SubPage';

export const Group = () => {
    const { showSnackSev } = useContext(SnackbarContext);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const { id: groupID } = useParams();

    const [group, setGroup] = React.useState<FetchedGroup>({
        id: '',
        invited: [],
        managers: [],
        members: [],
        name: '',
        requests: [],
    });
    const [inviteUtorid, setInviteUtorid] = React.useState('');
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);

    /**
     * Boolean function to check if the user is a manager of the group
     * @param user The user to check
     * @returns Whether the user is a manager of the group
     */
    const isManager = (user: User | string): boolean => {
        const userUtorid = typeof user === 'string' ? user : user.utorid;
        return !!group.managers.find((x) => x.utorid === userUtorid);
    };

    /**
     * Void function to get the group information
     */
    const getGroup = async () => {
        const { data, status } = await axios.get<FetchedGroup>('/groups/' + groupID);
        if (status !== 200) {
            showSnackSev('Could not fetch group', 'error');
            return;
        }
        setGroup(data);
    };

    useEffect(() => {
        getGroup();
    }, []);

    /**
     * Void function to invite someone to a group
     * @param utorid The utorid of the person to add
     */
    const addPerson = async (utorid: string) => {
        const { status } = await axios.post(`/groups/${groupID}/invite/`, {
            utorid,
        });
        if (status === 200) {
            showSnackSev('Person added', 'success');
        } else {
            showSnackSev('Could not add person', 'error');
            return;
        }
        await getGroup();
    };

    /**
     * Void function to remove  someone from a group
     * @param utorid The utorid of the person to remove
     */
    const removePerson = async (utorid: string) => {
        const { status } = await axios.post(`/groups/${groupID}/remove/`, {
            utorid,
        });

        if (status === 200) {
            showSnackSev('Person removed', 'success');
        } else {
            showSnackSev('Could not remove person', 'error');
            return;
        }
        await getGroup();
    };

    /**
     * Void function to delete a group
     */
    const delGroup = async () => {
        const { status } = await axios.delete(`/groups/${groupID}`);

        if (status === 200) {
            showSnackSev('Group deleted', 'success');
            navigate('/group', { replace: true }); // group doesnt exist, so go back
        } else {
            showSnackSev('Could not delete group', 'error');
            return;
        }
    };

    /**
     * Void function to change the role of a person
     * @param utorid The utorid of the person to change
     */
    const changeRole = async (utorid: string) => {
        const { status } = await axios.post(`/groups/${groupID}/changerole/`, {
            utorid,
            role: isManager(utorid) ? 'member' : 'manager',
        });
        if (status !== 200) {
            showSnackSev('Could not change role', 'error');
            return;
        }
        await getGroup();
    };

    return (
        <SubPage name={group.name}>
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
                    Add Student
                </Button>
                <Button
                    color="error"
                    onClick={() => {
                        setOpenDelete(true);
                    }}
                >
                    Delete Group
                </Button>
                <InputDialog
                    open={open}
                    setOpen={setOpen}
                    title="Add a student to your group"
                    description="To add a student to your group, please enter their UTORid below."
                    label="UTORid"
                    onSubmit={addPerson}
                />
            </Box>

            {/* list of people in the group */}
            {group.members.map((person) => (
                <Card key={person.utorid}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '1em',
                        }}
                    >
                        <Box>
                            <InitialsAvatar name={person.name} />
                        </Box>
                        <Box>
                            <Typography variant="h5">
                                {person.name}{' '}
                                <Typography sx={{ color: 'grey', display: 'inline' }}>({person.utorid})</Typography>
                            </Typography>
                            {isManager(person) ? <Typography color="success">Group manager</Typography> : null}
                            <Typography variant="body1">{person.email}</Typography>
                        </Box>
                    </CardContent>
                    {userInfo.utorid === person.utorid || !isManager(userInfo) ? null : (
                        <CardActions>
                            <Button
                                onClick={() => {
                                    changeRole(person.utorid);
                                }}
                            >
                                {isManager(person) ? 'Demote to Member' : 'Make Admin'}
                            </Button>

                            <Button
                                color="error"
                                onClick={() => {
                                    removePerson(person.utorid);
                                    if (userInfo.utorid === person.utorid) {
                                        navigate('/group', { replace: true });
                                    }
                                }}
                            >
                                Remove Student
                            </Button>
                        </CardActions>
                    )}
                </Card>
            ))}
            <ConfirmationDialog
                open={openDelete}
                setOpen={setOpenDelete}
                title="Delete Group"
                description="Are you sure you want to delete this group?"
                onConfirm={delGroup}
            />
        </SubPage>
    );
};
