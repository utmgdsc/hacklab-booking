import { Card, CardContent, Grid, Box, Typography } from '@mui/material';
import { InitialsAvatar } from '../InitialsAvatar/InitialsAvatar';

/**
 * A card for basic user info
 */
export const UserCard = ({ userInfo }: {
    /** The user info to display */
    userInfo: FetchedUser
}) => {
    return (
        <Card variant="outlined">
            {/* less spacing when grid items are stacked */}
            <CardContent component={Grid} container spacing={[4, 4, 8, 8, 8, 8]}>
                <Grid item md={8}>
                    <Typography variant="h2" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="gray">Some information will be visible to other users.</Typography>
                </Grid>
                <Grid
                    item
                    md={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: '1em',
                        alignItems: 'center',
                    }}
                >
                    <InitialsAvatar name={userInfo.name} />
                    <Box>
                        <Typography title="Your Name">
                            <strong>{userInfo.name}</strong>
                        </Typography>
                        <Typography variant="gray" title="Your Email">
                            {userInfo.email}
                        </Typography>
                        <br></br>
                        <Typography variant="gray" title="Your UTORid">
                            {userInfo.utorid}
                        </Typography>
                    </Box>
                </Grid>
            </CardContent>
        </Card>
    );
};
