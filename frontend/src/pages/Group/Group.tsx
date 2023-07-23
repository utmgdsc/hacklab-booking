import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import { ConfirmationDialog, InitialsAvatar, InputDialog } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { UserContext } from '../../contexts/UserContext';
import { SubPage } from '../../layouts/SubPage';
import { Add, ExitToApp, SupervisorAccount, PersonRemove } from '@mui/icons-material';

/**
 * Card for a person in the group
 * @param person The person to display
 * @param changeRole Function to change the role of the person
 * @param removePerson Function to remove the person from the group
 * @param invited hides the card actions if the person is not invited
 */
const PersonCard = ({
    person,
    changeRole,
    removePerson,
    isManager,
    invited,
}: {
    person: User;
    changeRole: (utorid: string) => void;
    removePerson: (utorid: string) => void;
    isManager: (person: User) => boolean;
    invited?: boolean;
}) => {
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <Card variant="outlined" sx={{ marginBottom: '1em' }}>
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
            {invited || userInfo.utorid === person.utorid || !isManager(userInfo) ? null : (
                <CardActions>
                    <Button
                        startIcon={<SupervisorAccount />}
                        onClick={() => {
                            changeRole(person.utorid);
                        }}
                    >
                        {isManager(person) ? 'Demote to Member' : 'Make Admin'}
                    </Button>

                    <Button
                        startIcon={<PersonRemove />}
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
    );
};
export const Group = () => {
    const { showSnackSev } = useContext(SnackbarContext);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const { id: groupID } = useParams();
    const { userInfo } = useContext(UserContext);

    const [group, setGroup] = React.useState<FetchedGroup>({
        id: '',
        invited: [],
        managers: [],
        members: [],
        name: '',
        requests: [],
    });
    const navigate = useNavigate();

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
        await axios
            .get<FetchedGroup>('/groups/' + groupID)
            .then((res) => res.data)
            .then((data) => {
                setGroup(data);
            })
            .catch((err) => {
                showSnackSev(`Could not fetch group: ${err.message}`, 'error');
                console.error(err);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    /**
     * Void function to invite someone to a group
     * @param utorid The utorid of the person to add
     */
    const addPerson = async (utorid: string) => {
        await axios
            .post(`/groups/${groupID}/invite/`, {
                utorid,
            })
            .then((res) => {
                if (res.status === 200) {
                    showSnackSev('Person added', 'success');
                } else {
                    showSnackSev('Could not add person', 'error');
                }
            })
            .catch((err) => {
                showSnackSev(`Could not add person: ${err.message}`, 'error');
                console.error(err);
            })
            .finally(async () => {
                await getGroup();
            });
    };

    /**
     * Void function to remove  someone from a group
     * @param utorid The utorid of the person to remove
     */
    const removePerson = async (utorid: string) => {
        await axios
            .post(`/groups/${groupID}/remove/`, {
                utorid,
            })
            .then((res) => {
                if (res.status === 200) {
                    showSnackSev('Person removed', 'success');
                } else {
                    showSnackSev('Could not remove person', 'error');
                }
            })
            .catch((err) => {
                showSnackSev(`Could not remove person: ${err.message}`, 'error');
                console.error(err);
            })
            .finally(async () => {
                await getGroup();
            });
    };

    /**
     * Void function to delete a group
     */
    const delGroup = async () => {
        await axios
            .delete(`/groups/${groupID}`)
            .then((res) => {
                if (res.status === 200) {
                    showSnackSev('Group deleted', 'success');
                    navigate('/group', { replace: true }); // group doesnt exist, so go back
                } else {
                    showSnackSev('Could not delete group', 'error');
                }
            })
            .catch((err) => {
                showSnackSev(`Could not delete group: ${err.message}`, 'error');
                console.error(err);
            })
            .finally(async () => {
                await getGroup();
            });
    };

    /**
     * Void function to change the role of a person
     * @param utorid The utorid of the person to change
     */
    const changeRole = async (utorid: string) => {
        await axios
            .post(`/groups/${groupID}/changerole/`, {
                utorid,
                role: isManager(utorid) ? 'member' : 'manager',
            })
            .then((res) => {
                if (res.status === 200) {
                    showSnackSev('Role changed', 'success');
                } else {
                    showSnackSev('Could not change role', 'error');
                }
            })
            .catch((err) => {
                showSnackSev(`Could not change role: ${err.message}`, 'error');
                console.error(err);
            })
            .finally(async () => {
                await getGroup();
            });
    };

    return (
        <SubPage name={group.name}>
            {/* menu bar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: '1em',
                }}
            >
                <Button
                    color="error"
                    startIcon={<ExitToApp />}
                    onClick={() => {
                        // TODO: leave group
                    }}
                >
                    Leave Group
                </Button>
                {isManager(userInfo.utorid) ? (
                    <Box sx={{
                        display: 'flex',
                        gap: '1em',
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
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
                ) : null}
            </Box>

            {/* list of people in the group */}
            {group.members.map((person) => (
                <PersonCard
                    changeRole={changeRole}
                    isManager={isManager}
                    key={person.utorid}
                    person={person}
                    removePerson={removePerson}
                />
            ))}

            {group.invited.length === 0 ? null : (
                <>
                    <Typography variant="h2" sx={{ margin: '2em 0 0.5em 0' }}>
                        Pending Invites
                    </Typography>
                    {group.invited.map((person) => (
                        <PersonCard
                            changeRole={changeRole}
                            isManager={isManager}
                            key={person.utorid}
                            person={person}
                            removePerson={removePerson}
                            invited
                        />
                    ))}
                </>
            )}

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
