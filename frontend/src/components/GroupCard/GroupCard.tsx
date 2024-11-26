import { Button, Card, CardActions, CardContent, Chip, Tooltip, Typography, Box} from '@mui/material';

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
                <Box component="ul" sx={{display: 'flex', flexWrap: 'wrap', listStyle:'none', p: 0.5, m:0}}>
                    {groupObj.members.map((member) => {
                        return (
                          <Box key={member.utorid} component="li" sx ={{p: 0.5}}>
                            <Tooltip title={member.email}>
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
                          </Box>
                        );
                    })}
                </Box>
            </CardContent>
            <CardActions>
                <Link href={'/group/' + groupObj.id}>
                    <Button>View</Button>
                </Link>
            </CardActions>
        </Card>
    );
};
