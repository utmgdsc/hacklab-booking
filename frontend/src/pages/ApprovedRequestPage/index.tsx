import { CheckCircle as CheckCircleIcon, Error } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { catchAxiosError } from '../../axios';
import { ErrorPage } from '../../layouts/ErrorPage';
import { SnackbarContext } from '../../contexts/SnackbarContext';

/**
 * Approve or deny a booking request
 * @property {boolean} approved Whether to approve or deny the request.
 */
export const ApprovedRequestPage = ({ approved }: { approved: boolean }) => {
    const { id } = useParams();
    const theme = useTheme();
    const [error, setError] = useState<string | undefined>();
    const [resolved, setResolved] = useState<boolean>();
    const { showSnackSev } = useContext(SnackbarContext);

    if (!id) {
        setError('No booking ID provided!');
    }

    const approve = async () => {
        try {
            const res = await axios.put<{ message: string }>(`/requests/${id}/${approved ? 'approve' : 'deny'}`);
            if (res.status !== 200) {
                setError(res.data.message);
                return;
            }
            setResolved(true);
        } catch (e) {
            if ((e as AxiosError).response) {
                setError((e as AxiosError<{ message: string }>).response?.data?.message || 'An error occurred');
            } else {
                catchAxiosError(undefined, showSnackSev)(e as AxiosError<{ message?: string }>);
            }
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        void approve();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <ErrorPage
                name="Error"
                message={<>{error}</>}
                graphic={
                    <Error
                        sx={{
                            fontSize: '10em',
                            color: theme.palette.error.main,
                        }}
                    />
                }
            />
        );
    }

    if (resolved) {
        return (
            <ErrorPage
                name={`Booking request ${approved ? 'approved' : 'denied'}!`}
                graphic={
                    <CheckCircleIcon
                        sx={{
                            fontSize: '10em',
                            color: theme.palette.success.main,
                        }}
                    />
                }
            />
        );
    }
};
