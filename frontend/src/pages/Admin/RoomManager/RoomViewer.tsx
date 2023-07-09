import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableVirtuoso } from 'react-virtuoso';
import axios from "../../../axios";
import { VirtuosoTableComponents } from '../../../components';
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { SubPage } from "../../../layouts/SubPage";

interface TableRowData {
    [key: string]: any;
    label: string;
    dataKey: string;
}

const userColumns: TableRowData[] = [
    { label: 'UTORid', dataKey: 'utorid' },
    { label: 'Email', dataKey: 'email' },
    { label: 'Role', dataKey: 'role' },
];

const requestColumns: TableRowData[] = [
    { label: 'ID', dataKey: 'id' },
    { label: 'Group ID', dataKey: 'groupId' },
    { label: 'Description', dataKey: 'description' },
    { label: 'Title', dataKey: 'title' },
    { label: 'Created At', dataKey: 'createdAt' },
    { label: 'Status', dataKey: 'status' },
    { label: 'Start Time', dataKey: 'startDate' },
    { label: 'End Time', dataKey: 'endDate' },
    { label: 'Reason', dataKey: 'reason' },
];

/**
 * Table header for the table
 */
const fixedHeaderContent = (columns: TableRowData[]) => {
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

/**
 * A table that shoes a list of users given a list of users
 * @param rows a list of users
 */
const UserAccessTable = ({ rows, columns }: { rows: any[], columns: TableRowData[] }) => {
    return (
        <Paper style={{ height: '90vh', width: '100%' }} elevation={0}>
            <TableVirtuoso
                data={rows}
                components={VirtuosoTableComponents}
                fixedHeaderContent={() => {
                    return (fixedHeaderContent(columns))
                }}
                itemContent={(_index, row: TableRowData) => (
                    <>
                        {columns.map((column, index) => {
                            if (index === 3) {
                                return <TableCell key={index}>{row[column.dataKey] ? 'Yes' : 'No'}</TableCell>;
                            } else if (index === 2) {
                                return (
                                    <TableCell key={index}>
                                        {row[column.dataKey]}
                                        {/* <RoleChanger
                                        utorid={row['utorid']}
                                        userRole={row['role']}
                                        setUpdate={setUpdate}
                                    /> */}
                                    </TableCell>
                                );
                            } else {
                                return <TableCell key={index}>{row[column.dataKey]}</TableCell>;
                            }
                        })}
                    </>
                )}
            />
        </Paper>
    )
}

export const RoomViewer = () => {
    const { showSnackSev } = useContext(SnackbarContext);
    const { id: roomId } = useParams();
    const [name, setName] = useState<string>(roomId);
    const [room, setRoomData] = useState<FetchedRoom>({
        capacity: -1,
        friendlyName: "Loading...",
        requests: [],
        roomName: "Loading...",
        userAccess: [],
    });
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    // get room data
    useEffect(() => {
        axios.get(`/rooms/${roomId}`).then((res) => {
            if (res.status === 200) {
                setRoomData(res.data);
                if (res.data.friendlyName && res.data.roomName) {
                    setName(`${res.data.friendlyName} (${res.data.roomName})`);
                } else {
                    showSnackSev("Room name not found", "error");
                }
                console.log(res.data);
            }
        })
            .catch((err) => {
                showSnackSev("Room not found", "error");
                console.error(err);
            });
    }, [roomId, showSnackSev])

    return (
        <SubPage name={name} maxWidth="xl">
            <Accordion expanded={expanded === 'access'} onChange={handleChange('access')} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Users with access to this room
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {room.userAccess.length} user(s) with access total
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserAccessTable rows={room.userAccess} columns={userColumns} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'history'} onChange={handleChange('history')} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        History of requests for this room
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {room.requests.length} request(s) total
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserAccessTable rows={room.requests} columns={requestColumns} />
                </AccordionDetails>
            </Accordion>

        </SubPage>
    )
}
