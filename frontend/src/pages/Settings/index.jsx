import React from "react";
import {
    Box,
    Typography,
    Container,
} from "@mui/material";
import { Link } from "../../components";

export const Settings = () => {
    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "4em"
                }}
            >
                <Typography variant="h4" sx={{ marginTop: "2em" }}>
                    Settings
                </Typography>
                <Typography variant="h4" sx={{ marginTop: "2em" }}>
                    <Link isInternalLink to="/">Back</Link>
                </Typography>
            </Box>

            <Typography variant="h5" sx={{ marginTop: "2em" }}>Webhooks</Typography>

            <Typography variant="h5" sx={{ marginTop: "2em" }}>Profile</Typography>

            <Typography variant="h5" sx={{ marginTop: "2em" }}>Appearance</Typography>


        </Container>
    );
};
