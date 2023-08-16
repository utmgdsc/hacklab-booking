import { Card, CardContent, Grid, Box, Typography, Skeleton } from '@mui/material';
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
                <Grid item md={6}>
                    <Typography variant="h2" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="gray">Some information will be visible to other users.</Typography>
                </Grid>
                <Grid
                    item
                    md={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: '1em',
                        alignItems: 'center',
                    }}
                >
                    {/* show a skeleton when loading. mikuhatsune is an impossible utorid due to its length */}
                    {userInfo.utorid === "mikuhatsune" && (
                        <>
                            <InitialsAvatar />
                            <Box sx={{ width: "100%" }}>
                                <Skeleton variant="text"></Skeleton>
                                <Skeleton variant="text"></Skeleton>
                                <Skeleton variant="text"></Skeleton>
                            </Box>
                        </>
                    )
                    }
                    {userInfo.utorid !== "mikuhatsune" && (
                        <>
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
                        </>
                    )
                    }
                </Grid>
            </CardContent>
        </Card>
    );
};
