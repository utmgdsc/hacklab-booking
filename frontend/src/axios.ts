import axios from 'axios';
import { AlertColor } from '@mui/material';

/**
 * Axios instance
 */
export const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : `${process.env.REACT_APP_API_URL}/`,
});

export const catchAxiosError =
    (message: string | undefined, showSnackSev: (message?: string, sev?: AlertColor) => void) => (err: any) => {
        if (message) {
            if (err.response?.data?.message) {
                showSnackSev(`${message}: ${err.response.data.message}`, 'error');
                return;
            }
            showSnackSev(message, 'error');
            return;
        }
        if (err.response?.data?.message) {
            showSnackSev(`Something went wrong: ${err.response.data.message}`, 'error');
            return;
        }
        showSnackSev('Something went wrong', 'error');
    };

export default instance;
