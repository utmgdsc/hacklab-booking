import React from "react";
import {
    Button,
    TextField,
    Box
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom'

export const Track = () => {
    let { id } = useParams();
    const navigate = useNavigate();

    return (
        <SubPage name="Track a request">
            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "nowrap",
                marginBottom: "4em",
                component: "form"
            }}
            >
                <TextField fullWidth label="Tracking ID" id="fullWidth" defaultValue={id} />
                <Button
                    variant="contained"
                    color="primary"
                    id="track-button"
                    onClick={() => {
                        navigate("/track/" + document.getElementById("fullWidth").value);
                    }}
                    sx={{
                        marginLeft: "1em",
                        padding: "0 1.5em",
                        height: "56px"
                    }}>
                    <SearchIcon />
                    Track
                </Button>
            </Box>
            <Box>
                <h1>Tracking ID: {id}</h1>
            </Box>
        </SubPage>
    );
};
