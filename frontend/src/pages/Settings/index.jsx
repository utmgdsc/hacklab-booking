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
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { InitialsAvatar } from "../../components";
import { THEME } from "../../theme/theme";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";

export const Settings = () => {
    const { userInfo } = useContext(UserContext);

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
                        <InitialsAvatar name={userInfo["name"]} />
                        <Box>
                            <Typography title="Your Name"><strong>{userInfo["name"]}</strong></Typography>
                            <Typography variant="gray" title="Your Email">{userInfo["email"]}</Typography><br></br>
                            <Typography variant="gray" title="Your UTORid">{userInfo["utorid"]}</Typography>
                            <Typography variant="gray" title="Your Email">{userInfo["accessGranted"] && <><br></br>Hacklab Keycard Haver</>}</Typography>
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
                    <Button disabled>Manage</Button>
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
                        // onChange={(e) =>
                        //     fetch(process.env.REACT_APP_API_URL + "/accounts/modifyTheme", {
                        //         method: "POST",
                        //         headers: {
                        //             "Content-Type": "application/json",
                        //         },
                        //         body: JSON.stringify({
                        //             theme: e.target.value,
                        //         }),
                        //     })
                        //         .then(() => {
                        //             // reload the page
                        //             window.location.reload();
                        //         })
                        // }
                        value={userInfo["theme"] ?? null}
                    >
                        <FormControlLabel value={THEME.DEFAULT} control={<Radio />} label="System Default" />
                        <FormControlLabel value={THEME.LIGHT} control={<Radio />} label="Light" />
                        <FormControlLabel value={THEME.DARK} control={<Radio />} label="Dark" />
                    </RadioGroup>
                </CardActions>
            </Card>
        </SubPage>
    );
};
