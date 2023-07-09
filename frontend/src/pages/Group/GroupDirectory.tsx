import { Box, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import { GroupCard, InputDialog } from '../../components';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { SubPage } from '../../layouts/SubPage';

export const GroupDirectory = () => {
    /** context to show snackbars */
    const { showSnackSev } = useContext(SnackbarContext);
    /** create group dialog open state */
    const [open, setOpen] = React.useState(false);
    /** the groups that the user is a member of */
    let [myGroups, setMyGroups] = useState<FetchedGroup[]>([]);

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
    }, []);

    return (
        <SubPage name="Your Groups">
            <>
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

                {myGroups.map((group) => {
                    return <GroupCard key={group.id} groupObj={group} />;
                })}
            </>
        </SubPage>
    );
};
