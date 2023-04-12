import React from "react";
import {
    Box,
    Typography,
    Container,
    Button
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, ErrorBoundary } from "../components";
import { useNavigate } from "react-router-dom";

export const SubPage = ({ name, children, maxWidth = "md", py = 8, showHead = true, ...props }) => {
    React.useEffect(() => {
        document.title = 'Hacklab Booking - ' + name;
    }, [name]);

    const navigate = useNavigate();

    return (
        <Container sx={{ py: py }} maxWidth={maxWidth} component="main" {...props}>
            <Typography variant="h4" sx={{
                marginTop: {
                    xs: "-2em",
                    sm: "-1em",
                    md: "0em",
                    lg: "1em",
                    xl: "2em",
                },
            }}>
                <Button onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon /> Back
                </Button>
            </Typography>
            {showHead && (
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
            )}
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </Container>
    );
};
