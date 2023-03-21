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
        <SubPage name="All requests">

        </SubPage>
    );
};
