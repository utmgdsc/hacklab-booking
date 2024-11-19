import { Button, Card, CardActions, CardContent, Chip, Stack, Tooltip, Typography } from '@mui/material';

import { useContext } from 'react';
import { InitialsAvatar, Link } from '..';
import { SnackbarContext } from '../../contexts/SnackbarContext';

interface GroupCardProps {
    /** group object */
    groupObj: FetchedGroup;
}

/**
 * A card that displays information about a group
 */
export const GroupCard = ({ groupObj, ...props }: GroupCardProps) => {
    const { showSnackSev } = useContext(SnackbarContext);
    return (
        <Card variant="outlined" sx={{ mt: 2, mb: 2 }} {...props}>
            <CardContent>
                <Typography variant="h3" gutterBottom>
                    {groupObj.name}
                </Typography>
                <Typography variant="gray">Members:</Typography>
                <Stack direction="row" spacing={1} sx={{overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 2}}>
                    {groupObj.members.map((member) => {
                        return (
                            <Tooltip key={member.utorid} title={member.email}>
                                <Chip
                                    avatar={<InitialsAvatar name={member.name} />}
                                    label={member.name}
                                    variant="outlined"
                                    onClick={() => {
                                        // copy email to clipboard
                                        navigator.clipboard.writeText(member.email);
                                        showSnackSev('Email copied to clipboard', 'success');
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Stack>
            </CardContent>
            <CardActions>
                <Link href={'/group/' + groupObj.id}>
                    <Button>View</Button>
                </Link>
            </CardActions>
        </Card>
    );
};
