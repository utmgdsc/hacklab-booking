import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { useContext } from 'react';
import axios from '../../axios';
import { UserCard } from '../../components';
import { UserContext } from '../../contexts/UserContext';
import { SubPage } from '../../layouts/SubPage';
import { THEME } from '../../theme/theme';

export const Settings = () => {
    const { userInfo, fetchUserInfo } = useContext(UserContext);

    return (
        <SubPage name="Settings">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <UserCard userInfo={userInfo} />
                </Grid>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h2" gutterBottom>
                                Webhooks
                            </Typography>
                            <Typography variant="gray">
                                Manage automated notifications for your requests via webhooks
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button disabled>Manage</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h2" gutterBottom>
                                Appearance
                            </Typography>
                            <Typography variant="gray" id="appearance-radio-label">
                                Manage how the app looks and feels
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <RadioGroup
                                row
                                aria-labelledby="appearance-radio-label"
                                name="appearance-radio"
                                onChange={(e) =>
                                    axios
                                        .post('/accounts/changetheme', {
                                            theme: e.target.value,
                                        })
                                        .then(() => {
                                            fetchUserInfo();
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                        })
                                }
                                value={userInfo.theme}
                            >
                                <FormControlLabel value={THEME.DEFAULT} control={<Radio />} label="System Default" />
                                <FormControlLabel value={THEME.LIGHT} control={<Radio />} label="Light" />
                                <FormControlLabel value={THEME.DARK} control={<Radio />} label="Dark" />
                            </RadioGroup>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </SubPage>
    );
};
