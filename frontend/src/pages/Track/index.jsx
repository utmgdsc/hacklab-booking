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
    React.useEffect(() => {
        document.title = 'Hacklab Booking - Track';
    }, []);

    let { id } = useParams();
    const navigate = useNavigate();

    return (
        <SubPage name="All requests">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=hacklabbooking%40gmail.com&ctz=America%2FToronto"
              style={{width: "100%", height: "50em", border: "0"}}
            ></iframe>
        </SubPage>
    );
};
