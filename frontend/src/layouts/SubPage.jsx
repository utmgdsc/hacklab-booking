import React from "react";
import {
    Box,
    Typography,
    Container,
    Button
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from "../components";

export const SubPage = ({ name, children }) => {
    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <Typography variant="h4" sx={{
                marginTop: {
                    xs: "-2em",
                    sm: "-1em",
                    md: "0em",
                    lg: "1em",
                    xl: "2em",
                },
            }}>
                <Link isInternalLink to="/">
                    <Button>
                        <ArrowBackIosIcon /> Back
                    </Button>
                </Link>
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "4em"
                }}
            >
                <Typography variant="h1" gutterBottom sx={{ marginTop: "2em" }}>
                    {name}
                </Typography>

            </Box>
            {children}
        </Container>
    );
};