import React from "react";
import {
    Button,
    TextField,
    Box
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom'
import { ActiveRequestCard } from "../../components/";

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
                <TextField
                    fullWidth
                    label="Tracking ID"
                    id="fullWidth"
                    defaultValue={id}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            // press enter to navigate to track page
                            navigate("/track/" + document.getElementById("fullWidth").value);
                            ev.preventDefault();
                        }
                    }}
                />
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
                {/* <h1>Tracking ID: {id}</h1> */}

                {
                    (!isNaN(parseFloat(id))) &&
                    <ActiveRequestCard
                        title="Machine Learning Workshop"
                        date="2021-10-10"
                        location="DH 2014 (Hacklab)"
                        status={id}
                    />
                }
            </Box>
        </SubPage>
    );
};
