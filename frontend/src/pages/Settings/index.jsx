import React from "react";
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";

export const Settings = () => {
    return (
        <SubPage name="Settings">
            <Card>
                <CardContent>
                    <Typography variant="h2" gutterBottom>Profile</Typography>
                    <Typography variant="gray">Some information will be visible to other users</Typography>
                </CardContent>
                <CardActions>
                    <Button>Manage</Button>
                </CardActions>
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
                    <Typography variant="gray">Manage how the app looks and feels</Typography>
                </CardContent>
                <CardActions>
                    <Button>Manage</Button>
                </CardActions>
            </Card>
        </SubPage>
    );
};
