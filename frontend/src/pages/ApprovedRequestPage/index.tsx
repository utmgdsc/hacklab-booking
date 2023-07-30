import { CheckCircle as CheckCircleIcon, Error } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { ErrorPage } from '../../layouts/ErrorPage';

/**
 * Approve or deny a booking request
 * @param {boolean} approved Whether to approve or deny the request.
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
                name="Booking request approved!"
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
