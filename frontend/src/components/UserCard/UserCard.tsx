import { Card, CardContent, Box, Typography } from '@mui/material';
import { InitialsAvatar } from '../InitialsAvatar/InitialsAvatar';

/**
 * A card for basic user info
 * @param userInfo The user info to display
 */
export const UserCard = ({ userInfo }: { userInfo: FetchedUser }) => {
    return (
        <Card variant="outlined">
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '1em',
                }}
            >
                <Box>
                    <Typography variant="h2" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="gray">Some information will be visible to other users.</Typography>
                </Box>
                <Box
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
                        {/* <Typography variant="gray" title="Your Email">
                            {userInfo.roomAccess && (
                                <>
                                    <br></br>Hacklab Keycard Haver
                                </>
                            )}
                        </Typography> */}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
