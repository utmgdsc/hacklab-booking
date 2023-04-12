import {
    Paper,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TableVirtuoso } from 'react-virtuoso';
import { Link, VirtuosoTableComponents } from "../../../components";
import { UserContext } from "../../../contexts/UserContext";
import { SubPage } from "../../../layouts/SubPage";

const columns = [
    // { label: "id", dataKey: "_id" },
    { label: "title", dataKey: "title" },
    { label: "approval reason", dataKey: "reason" },
    { label: "status", dataKey: "status" },
    { label: "approver", dataKey: "approver" },
    { label: "group", dataKey: "group[name]" },
    { label: "room", dataKey: "room[roomName]" },
    { label: "start date", dataKey: "start_date" },
    { label: "end date", dataKey: "end_date" },
];

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column}
                    variant="head"
                    sx={{
                        backgroundColor: "background.paper",
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

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
                    You are not an admin.{" "}
                    <Link isInternalLink href="/">
                        Go back
                    </Link>
                </Typography>
            </SubPage>
        );
    }

    return (
        <SubPage name="Request Log" maxWidth="xl">
            <Paper style={{ height: "90vh", width: "100%" }}>
                <TableVirtuoso
                    data={requests}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={(index, row) => (
                        <>
                            {columns.map((column, index) => {
                                if (column.dataKey === "room[roomName]") {
                                    return (
                                        <TableCell key={index}>{row["room"]["roomName"]}</TableCell>
                                    );
                                } else if (column.dataKey === "approver") {
                                    return (
                                        <TableCell key={index}>{row["approver"]["name"]}</TableCell>
                                    );
                                } else if (column.dataKey === "start_date" || column.dataKey === "end_date") {
                                    return (
                                        <TableCell key={index}>{new Date(row[column.dataKey]).toLocaleString("en-ca", {
                                            timeZone: 'EST',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                        })}</TableCell>
                                    );
                                } else if (column.dataKey === "group[name]") {
                                    return (
                                        <TableCell key={index}>{row["group"]["name"]}</TableCell>
                                    );
                                } else {
                                    return (
                                        <TableCell key={index}>{row[column.dataKey]}</TableCell>
                                    );
                                }
                            })}
                        </>
                    )}
                />
            </Paper>
        </SubPage>
    );
};
