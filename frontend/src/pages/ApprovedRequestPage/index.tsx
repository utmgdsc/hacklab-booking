import { CheckCircle as CheckCircleIcon, Error } from '@mui/icons-material';
import { Container, Typography, useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

/**
 * Edit a booking given a UUID or create a new booking if no UUID is given
 */
export const ApprovedRequestPage = ({ approved }: { approved: boolean }) => {
    const { id } = useParams();
    const theme = useTheme();
    const [error, setError] = useState<string | undefined>();
    const [resolved, setResolved] = useState<boolean>();
    if (!id) {
        setError('No booking ID provided!');
    }

    const approve = async () => {
        try {
            const res = await axios.put(`/requests/${id}/${approved ? 'approve' : 'deny'}`);
            if (res.status !== 200) {
                setError(res.data.message);
                return;
            }
            setResolved(true);
        } catch (e) {
            if ((e as AxiosError).response) {
                setError(((e as AxiosError).response.data as { message: string }).message);
            }
        }
    };

    useEffect(() => {
        console.log('using effect');
        if (!id) {
            return;
        }
        void approve();
    }, []);

    if (error) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    marginBottom: '2em',
                    gap: '1em',
                }}
            >
                <Error
                    sx={{
                        fontSize: '10em',
                        color: theme.palette.error.main,
                    }}
                />

                <Typography component="p" variant="h3">
                    {error}
                </Typography>
            </Container>
        );
    }
    if (resolved) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    marginBottom: '2em',
                    gap: '1em',
                }}
            >
                <CheckCircleIcon
                    sx={{
                        fontSize: '10em',
                        color: 'green',
                    }}
                />

                <Typography component="p" variant="h3">
                    {'Booking approved!'}
                </Typography>
            </Container>
        );
    }
};
