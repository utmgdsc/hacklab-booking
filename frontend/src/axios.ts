import axios from 'axios';
import { AlertColor } from '@mui/material';
import React from 'react'

/**
 * Axios instance
 */
export const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : `${process.env.REACT_APP_API_URL}/`,
});
instance.interceptors.request.use((config) => {
    document.getElementById('loading').style.display = 'flex';
    return config;
});
instance.interceptors.response.use((response) => {
    document.getElementById('loading').style.display = 'none';
    return response;
});
export const catchAxiosError =
    (message: string | undefined, showSnackSev: (message?: string, sev?: AlertColor) => void) => (err: any) => {
        if (!err.response) {
            showSnackSev('Server did not respond, please open an issue on our Github', 'error');
            console.error(err);
            return;
        }
        if (err.response?.status >= 500) {
            showSnackSev('Something went wrong, please try again later', 'error');
            console.error(err);
            return;
        }
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
