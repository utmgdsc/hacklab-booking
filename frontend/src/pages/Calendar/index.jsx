import React from "react";
import {
    Button,
    TextField,
    Box
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom'
import { ActiveRequestCard } from "../../components";

export const Calendar = () => {
    let { id } = useParams();
    const navigate = useNavigate();

    return (
        <SubPage name="Hacklab Calendar">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=hacklabbooking%40gmail.com&ctz=America%2FToronto"
              style={{width: "100%", height: "50em", border: "0"}}
              title="Hacklab Calendar"
            ></iframe>
        </SubPage>
    );
};
