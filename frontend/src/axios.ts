import axios, { InternalAxiosRequestConfig } from 'axios';
import { AlertColor } from '@mui/material';
import React from 'react';
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipLoadingWheel?: boolean;
    }
}
/**
 * Axios instance
 */
export const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : `${process.env.REACT_APP_API_URL}/`,
});

let loading = false;
instance.interceptors.request.use((config) => {
    if ('skipLoadingWheel' in config && config.skipLoadingWheel === true) {
        return config;
    }
    document.getElementById('loading').style.display = 'flex';
    loading = true;
    return config;
});
instance.interceptors.response.use((response) => {
    if ('skipLoadingWheel' in response.config && response.config.skipLoadingWheel === true) {
        return response;
    }
    loading = false;
    setTimeout(() => {
        if (!loading) {
            document.getElementById('loading').style.display = 'none';
        }
    }, 500);
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
