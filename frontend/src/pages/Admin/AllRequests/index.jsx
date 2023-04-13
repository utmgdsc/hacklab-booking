import {
    Paper,
    TableCell,
    TableRow
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TableVirtuoso } from 'react-virtuoso';
import { Link, VirtuosoTableComponents } from "../../../components";
import { UserContext } from "../../../contexts/UserContext";
import { SubPage } from "../../../layouts/SubPage";
import { ErrorPage } from "../../../layouts/ErrorPage";

const columns = [
    // { label: "id", dataKey: "_id" },
    { label: "title", dataKey: "title" },
    { label: "approval reason", dataKey: "reason" },
    { label: "status", dataKey: "status" },
    { label: "approver", dataKey: "approver", subKey:"name" },
    { label: "group", dataKey: "group", subKey: "name" },
    { label: "room", dataKey: "room", subKey: "roomName" },
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
                // console.log(data);

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
          <ErrorPage
            name="You are not an admin"
            message={
              <Link href="/">Go back</Link>
            }
          />
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
                                if (column.dataKey === "start_date" || column.dataKey === "end_date") {
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
                                } else if (column.subKey) {
                                    return (
                                        <TableCell key={index}>{row[column.dataKey][column.subKey]}</TableCell>
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
