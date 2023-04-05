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
import { SubPage } from "../../layouts/SubPage";
import { Link } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";


const columns = [
    { label: 'UTORid', dataKey: 'utorid' },
    { label: 'Email', dataKey: 'email' },
    // { label: 'Room Requested', dataKey: 'room' },
    // { label: 'Professor Approved', dataKey: 'prof' },
    { label: 'Grant Access', dataKey: 'accessGranted' },
];

const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    sx={{
                        backgroundColor: 'background.paper',
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

export const Admin = () => {
    const userInfo = useContext(UserContext);
    const [filterPending, setFilterPending] = useState(false);
    const [rowsToDisplay, setRowsToDisplay] = useState(null);
    const [rows, setRows] = useState(null);
    const [update, setUpdate] = useState(0);

    // useEffect hook for fetching the rows
    useEffect(() => {
        document.title = 'Hacklab Booking - Admin';

        fetch(process.env.REACT_APP_API_URL + '/accounts/all', {
            method: 'GET',
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            setRows(data);
            setRowsToDisplay(data);
            setUpdate(Math.random());
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    // useEffect hook for changing the rows to display based on the filter
    useEffect(() => {
        if (rows) {
            if (filterPending) {
                setRowsToDisplay(rows.filter(row => row['accessGranted'] === false));
            } else {
                setRowsToDisplay(rows);
            }
        }
    }, [filterPending, rows]);

    if (userInfo["role"] !== "admin") {
        return (
            <SubPage name="Admin">
                <Typography variant="h4" component="h1" gutterBottom>
                    You are not an admin. <Link isInternalLink to="/">Go back</Link>
                </Typography>
            </SubPage>
        );
    }

    return (
        <SubPage name="Admin" maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 2,
                }}
            >
                <Box>
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="filter-pending"
                                    checked={filterPending}
                                    onChange={() => {
                                        setFilterPending(!filterPending);
                                    }}
                                    name="filter-pending"
                                />}
                            label="Show only pending requests"
                        />
                    </FormControl>
                </Box>
                {/* <Button
                    onClick={() => {
                        // todo daksh: send request to backend to grant access to all
                        console.log("Granting access to all");
                        for (let i = 0; i < rowsToDisplay.length; i++) {
                            rowsToDisplay[i]['grant'] = true;
                        }
                        // update state of parent component
                        setUpdate(Math.random());
                    }}
                >
                    Mark all as granted
                </Button> */}
            </Box>
            <Paper style={{ height: "90vh", width: '100%' }}>
                <TableVirtuoso
                    data={rowsToDisplay}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={
                        (index, row) => <>
                            {columns.map((column, index) => (
                                (column.dataKey === 'accessGranted' && row[column.dataKey] === false) ? (
                                    <TableCell key={index}>
                                        <Button
                                            onClick={() => {
                                                // send post request to api to grant access
                                                fetch(process.env.REACT_APP_API_URL + '/accounts/modifyAccess/' + row['utorid'], {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        "accessGranted": true
                                                    })
                                                })
                                                .then(res => {
                                                    return res.json();
                                                })
                                                .then(data => {
                                                    console.log(data);
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                });

                                                console.log("Granting access to " + row['utorid']);
                                                // update row['grant'] to true
                                                row['accessGranted'] = true;
                                                setUpdate(Math.random());
                                            }}
                                        >Approve</Button>
                                    </TableCell>
                                ) : (
                                    <TableCell key={index}> {row[column.dataKey]} </TableCell>
                                )))}
                        </>
                    }
                />
            </Paper>
        </SubPage>
    );
};
