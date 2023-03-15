import React from "react";
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Divider,
    Stack,
    TextField,
    MenuItem,
    InputLabel,
    Select,
    Input,
    Chip,
    Avatar,
    Grid,
    Dialog,
    DialogActions,
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { InitialsAvatar } from "../../components";
import { setTheme, getTheme, THEME } from "../../theme/theme";

const profile = {
    name: "Hatsune Miku",
    email: "h.miku@utoronto.ca",
    utorid: "hatsunem",
}

export const Settings = () => {
    return (
        <SubPage name="Settings">
            <Card>
                <CardContent sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "1em",
                }}>
                    <Box>
                        <Typography variant="h2" gutterBottom>Profile</Typography>
                        <Typography variant="gray">Some information will be visible to other users.</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "1em",
                        alignItems: "center",
                    }}>
                        <InitialsAvatar name={profile.name} />
                        <Box>
                            <Typography><strong>{profile.name}</strong></Typography>
                            <Typography variant="gray">{profile.email}</Typography><br></br>
                            <Typography variant="gray">{profile.utorid}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h2" gutterBottom>Webhooks</Typography>
                    <Typography variant="gray">Manage automated notifications for your requests via webhooks</Typography>
                </CardContent>
                <CardActions>
                    <Button>Manage</Button>
                </CardActions>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h2" gutterBottom>Appearance</Typography>
                    <Typography variant="gray" id="appearance-radio-label">Manage how the app looks and feels</Typography>
                </CardContent>
                <CardActions>
                    <RadioGroup
                        row
                        aria-labelledby="appearance-radio-label"
                        name="appearance-radio"
                        onChange={(e) => setTheme(e.target.value)}
                        value={getTheme()}
                    >
                        <FormControlLabel value={THEME.DEFAULT} control={<Radio />} label="System Default" />
                        <FormControlLabel value={THEME.DARK} control={<Radio />} label="Light" />
                        <FormControlLabel value={THEME.LIGHT} control={<Radio />} label="Dark" />
                    </RadioGroup>
                </CardActions>
            </Card>
        </SubPage>
    );
};
