import { Container } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import {
    ActiveRequestCard,
    NoRequestsPlaceholder
} from '../../components';
import { UserContext } from '../../contexts/UserContext';
import { SubPage } from '../../layouts/SubPage';

/**
 * all active requests cards given a list of active requests
 * @param {*} active_requests a list of requests received from the backend
 * @returns past requests cards
 */
const PastRequestCards = ({ active_requests }: { active_requests: FetchedBookingRequest[] }) => (
    <>
        {active_requests.length === 0 && <NoRequestsPlaceholder text={'Nothing to see here :)'} />}
        {active_requests.map((request) => {
            return (
                <ActiveRequestCard
                    booking={request}
                    ownerHasTCard={!!request['author']['roomAccess'].find((room) => room.roomName === request.roomName)}
                    edit={undefined}
                    cancel={undefined}
                    viewOnly={true}
                    key={request.id}
                />
            );
        })}
    </>
);

export const PastRequestsDashboard = () => {
    const { userInfo } = useContext(UserContext);
    const [my_requests, setMyRequests] = useState<FetchedBookingRequest[]>([]);
    const update = async () => {
        await axios
            .get<FetchedBookingRequest[]>(`requests?start_date=${new Date(1)}`)
            .then((res) => res.data)
            .then((data) => {
                setMyRequests(
                    data
                        .filter(
                            (request) =>
                                request.authorUtorid === userInfo.utorid &&
                                userInfo.groups.find((groupRequest) => groupRequest.id === request.groupId) &&
                                (new Date(request.endDate) < new Date() ||
                                    (['denied', 'cancelled'] as BookingStatus[]).includes(request.status)),
                        )
                        .sort((a, b) => (a.startDate > b.startDate ? -1 : 1)),
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        update();
    }, [userInfo]);

    return (
        <SubPage name="Your Past Requests">
            <Container sx={{ py: 8 }} maxWidth="md" component="main">
                <PastRequestCards active_requests={my_requests} />
            </Container>
        </SubPage>
    );
};
