import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    CalendarToday as CalendarTodayIcon,
    Inventory as InventoryIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

import { Container, Typography, useTheme } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import {
    ActiveRequestCard,
    AppButtons,
    DashboardHeader,
    EditBooking,
    NoRequestsPlaceholder,
    PendingRequestCard,
} from '../../components';
import { AppButton } from '../../components/AppButtons/AppButtons';
import { UserContext } from '../../contexts/UserContext';

/**
 * all active requests cards given a list of active requests
 * @param {*} active_requests a list of requests received from the backend
 * @param {*} editThisRequest a function that will be called when a user wants to edit a request
 * @param {*} cancelThisRequest a function that will be called when a user wants to cancel a request
 * @returns all active requests cards
 */
const ActiveRequestCards = ({
    active_requests,
    editThisRequest,
    cancelThisRequest,
}: {
    active_requests: FetchedBookingRequest[];
    editThisRequest: (reqID: string) => void;
    cancelThisRequest: (reqID: string) => void;
}) => (
    <>
        <Typography variant="h2" gutterBottom>
            Your Active Requests
        </Typography>
        {active_requests.length === 0 && (
            <NoRequestsPlaceholder text={"You have no active requests. Create one using the 'Book' button above."} />
        )}
        {active_requests.map((request) => {
            return (
                <ActiveRequestCard
                    booking={request}
                    ownerHasTCard={!!request['author']['roomAccess'].find((room) => room.roomName === request.roomName)}
                    edit={editThisRequest}
                    cancel={cancelThisRequest}
                    viewOnly={false}
                    key={request.id}
                />
            );
        })}
    </>
);

/**
 * all pending requests cards given a list of pending requests
 * @param {*} pending_requests a list of requests received from the backend
 * @param {*} onUpdate a function that will be called when a user wants to change a request
 * @returns all pending requests cards
 */
const PendingRequestCards = ({
    pending_requests,
    onUpdate,
}: {
    pending_requests: FetchedBookingRequest[];
    onUpdate: () => void;
}) => (
    <>
        <Typography variant="h2" gutterBottom>
            Your Pending Requests
        </Typography>
        {pending_requests.length === 0 && <NoRequestsPlaceholder text={'No requests demand your attention. Horray!'} />}
        {pending_requests.map((request) => {
            return <PendingRequestCard key={request.id} booking={request} onUpdate={onUpdate} />;
        })}
    </>
);

export const Dashboard = () => {
    const { userInfo, fetchUserInfo } = useContext(UserContext);
    const [pending_requests, setPendingRequests] = useState<FetchedBookingRequest[]>([]);
    const [my_requests, setMyRequests] = useState<FetchedBookingRequest[]>([]);
    const [editRequestID, setEditRequestID] = useState<string | null>(null);
    const [openEditRequest, setOpenEditRequest] = useState(false);
    const [updateValue, setUpdateValue] = useState<Number>();

    React.useEffect(() => {
        document.title = 'Hacklab Booking System';
    });

    const editThisRequest = (reqID: string) => {
        setEditRequestID(reqID);
        setOpenEditRequest(true);
    };

    const cancelThisRequest = (reqID: string) => {
        axios.delete('/requests/' + reqID);

        fetchUserInfo();
    };

    useEffect(() => {
        const update = async () => {
            await axios
                .get<FetchedBookingRequest[]>('/requests')
                .then((res) => res.data)
                .then((data) => {
                    setMyRequests(
                        data.filter(
                            (request) =>
                                request.authorUtorid === userInfo.utorid &&
                                userInfo.groups.find((groupRequest) => groupRequest.id === request.groupId) &&
                                request.status !== 'cancelled',
                        ),
                    );
                    setPendingRequests(
                        data.filter(
                            (request) =>
                                request.status === 'pending' ||
                                (request.status === 'needTCard' && ['admin', 'tcard'].includes(userInfo.role)),
                        ),
                    );
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        update();
    }, [userInfo, updateValue]);

    const update = () => {
        setUpdateValue(Math.random);
    };

    /** mui theme object */
    const theme = useTheme();

    /**
     * all buttons on the dashboard
     */
    const homeButtons: AppButton[] = [
        {
            title: 'View Events',
            href: '/pastevents',
            icon: <InventoryIcon />,
            label: 'View Events',
            color: theme.palette.app_colors.red,
            hover: theme.palette.app_colors.hover.red,
        },
        {
            title: 'Create a booking for Professors to review',
            href: '/book',
            icon: <CalendarTodayIcon />,
            label: 'Book',
            color: theme.palette.app_colors.green,
            hover: theme.palette.app_colors.hover.green,
        },
        {
            title: "View the student group(s) you're in",
            href: '/group',
            icon: <PeopleIcon />,
            label: 'Groups',
            color: theme.palette.app_colors.blue,
            hover: theme.palette.app_colors.hover.blue,
        },
        {
            title: 'View and edit your profile',
            href: '/settings',
            icon: <SettingsIcon />,
            label: 'Settings',
            color: theme.palette.app_colors.yellow,
            hover: theme.palette.app_colors.hover.yellow,
        },
        {
            title: 'Admin dashboard',
            href: '/admin',
            icon: <AdminPanelSettingsIcon />,
            label: 'Admin',
            color: theme.palette.app_colors.purple,
            hover: theme.palette.app_colors.hover.purple,
            hidden: userInfo.role !== 'admin',
        },
    ];

    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <DashboardHeader active_requests={my_requests} pending_requests={pending_requests} />

            <AppButtons ButtonsToRender={homeButtons} />

            {openEditRequest && (
                <EditBooking isOpen={openEditRequest} reqID={editRequestID} setOpenEditRequest={setOpenEditRequest} />
            )}

            {(userInfo['role'] === 'admin' || userInfo['role'] === 'approver' || userInfo['role'] === 'tcard') && (
                <PendingRequestCards onUpdate={update} pending_requests={pending_requests} />
            )}

            <ActiveRequestCards
                active_requests={my_requests}
                editThisRequest={editThisRequest}
                cancelThisRequest={cancelThisRequest}
            />
        </Container>
    );
};
