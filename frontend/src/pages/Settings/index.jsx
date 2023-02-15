import React from "react";
import {
    Box,
    Typography
} from "@mui/material";

export const Settings = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "2em",
                marginBottom: "2em"
            }}
        >
            <Typography variant="h5">Settings</Typography>
            <Typography variant="h3"><strong>Coming Soon</strong></Typography>
        </Box>
    );
};
