import React from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl
} from "@mui/material";
import { TableVirtuoso } from 'react-virtuoso';
import { SubPage } from "../../../layouts/SubPage";
import { Link, ActiveRequestCard } from "../../../components";
import { UserContext } from "../../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

export const AllRequests = () => {
    const userInfo = useContext(UserContext);
    const [requests, setRequests] = useState(null);

    // useEffect hook for fetching the rows
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/requests/getAllRequests', {
            method: 'GET',
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                setRequests(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    if (userInfo["role"] !== "admin") {
        return (
            <SubPage name="Admin">
                <Typography variant="h4" component="h1" gutterBottom>
                    You are not an admin. <Link isInternalLink href="/">Go back</Link>
                </Typography>
            </SubPage>
        );
    }

    return (
        <SubPage name="All Requests" maxWidth="xl">
            {
                requests === null ? (
                    <Typography variant="h4" component="h1" gutterBottom>
                        Loading...
                    </Typography>
                ) : (
                    requests.map((request, index) => {
                        return (
                            <ActiveRequestCard
                                key={request["_id"]}
                                reqID={request["_id"]}
                                title={request["title"]}
                                description={request["description"]}
                                date={request["start_date"]}
                                location={request["room"]["friendlyName"]}
                                teamName={request["group"]["name"]}
                                status={request["status"]}
                                owner={request["owner"]["name"]}
                                ownerHasTCard={request["owner"]["accessGranted"]}
                                approver={request["approver"]["name"]}
                                viewOnly={true}
                            />
                        );
                    }
                    ))
            }
        </SubPage>
    );
};
