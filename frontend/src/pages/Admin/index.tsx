import { MeetingRoom, Person, Search } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import { Link } from '../../components';
import { SubPage } from '../../layouts/SubPage';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
    const navigate = useNavigate();

    return (
        <SubPage name="Admin" maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h2" gutterBottom>
                                <MeetingRoom /> Room Manager
                            </Typography>
                            <Typography variant="gray">
                                Create and view information on rooms. You can also view a list of all booking requests.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link href="/admin/room-manager">
                                <Button>Manage Rooms</Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h2" gutterBottom>
                                <Person /> User Manager
                            </Typography>
                            <Typography variant="gray" sx={{ display: 'block' }}>
                                Manage users and their permissions.
                            </Typography>

                            <FormControl
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: '1em',
                                    marginTop: '2em',
                                }}
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    navigate(`/admin/${e.currentTarget.querySelector('input').value}`);
                                }}
                            >
                                <TextField
                                    placeholder="Search for a user"
                                    variant="filled"
                                    label="UtorID"
                                    fullWidth
                                    size="small"
                                    inputProps={{
                                        maxLength: 8,
                                        pattern: '!/^[a-z|0-9]{1,8}$/',
                                    }}
                                />
                                <IconButton type="submit" aria-label="search" sx={{ height: '100%', width: 'auto' }}>
                                    <Search />
                                </IconButton>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </SubPage>
    );
};
