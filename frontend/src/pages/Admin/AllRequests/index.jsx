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
    FormControl,
    Grid
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

                data.forEach((request) => {
                    if (request["group"] === null) {
                        request["group"] = { "name": "Group Deleted" };
                    }
                });

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
                    <Grid container spacing={2}>
                        {
                            requests.map((request, index) => {
                                return (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <ActiveRequestCard
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
                                    </Grid>
                                );
                            })}
                    </Grid>
                )
            }
        </SubPage>
    );
};
