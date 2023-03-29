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


const rows = [];
for (let i = 0; i < 10000; i++) {
    rows.push({
        utorid: "utorid" + i,
        std_number: (i * 2147483647).toString().padStart(12, '0'),
        room: "DH1" + (i % 1000).toString().padStart(3, '0'),
        prof: "prof" + i,
        grant: false
    });
}


const columns = [
    { label: 'UTORid', dataKey: 'utorid' },
    { label: 'Student Number', dataKey: 'std_number' },
    { label: 'Room Requested', dataKey: 'room' },
    { label: 'Professor Approved', dataKey: 'prof' },
    { label: 'Grant Access', dataKey: 'grant' },
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

// function rowContent(_index, row) {
//     return (

//     );
// }

export const Admin = () => {
    const userInfo = useContext(UserContext);
    const [filterGranted, setFilterGranted] = useState(false);
    const [rowsToDisplay, setRowsToDisplay] = useState(rows);
    const [update, setUpdate] = useState(0);

    useEffect(() => {
        if (filterGranted) {
            setRowsToDisplay(rows.filter(row => !row['grant']));
        } else {
            setRowsToDisplay(rows);
        }
    }, [filterGranted, update]);

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
        <SubPage name="Admin">
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
                                    id="filter-ungranted"
                                    checked={filterGranted}
                                    onChange={() => {
                                        setFilterGranted(!filterGranted);
                                    }}
                                    name="filter-ungranted"
                                />}
                            label="Show only ungranted"
                        />
                    </FormControl>
                </Box>
                <Button
                    onClick={() => {
                        // todo daksh: send request to backend to grant access to all
                        console.log("Granting access to all");
                        for (let i = 0; i < rows.length; i++) {
                            rows[i]['grant'] = true;
                        }
                        // update state of parent component
                        setUpdate(Math.random());
                    }}
                >
                    Mark all as granted
                </Button>
            </Box>
            <Paper style={{ height: "90vh", width: '100%' }}>
                <TableVirtuoso
                    data={rowsToDisplay}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={
                        (index, row) => <>
                            {columns.map((column, index) => (
                                (column.dataKey === 'grant' && !row[column.dataKey]) ? (
                                    <TableCell key={index}>
                                        <Button
                                            onClick={() => {
                                                // todo daksh: send request to backend to grant access
                                                console.log("Granting access to " + row['utorid']);
                                                // update row['grant'] to true
                                                row['grant'] = true;
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
