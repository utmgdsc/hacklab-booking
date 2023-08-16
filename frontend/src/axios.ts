import axios, { InternalAxiosRequestConfig } from 'axios';
import { AlertColor } from '@mui/material';

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

let loading = 0;
instance.interceptors.request.use((config) => {
    if ('skipLoadingWheel' in config && config.skipLoadingWheel === true) {
        return config;
    }
    document.getElementById('axios-loading-backdrop').style.display = 'flex';
    loading += 1;
    return config;
});

instance.interceptors.response.use(
    (response) => {
        if ('skipLoadingWheel' in response.config && response.config.skipLoadingWheel === true) {
            return response;
        }
        loading -= 1;
        setTimeout(() => {
            if (loading === 0) {
                document.getElementById('axios-loading-backdrop').style.display = 'none';
            }
        }, 500);
        return response;
    },
    (error) => {
        loading -= 1;
        setTimeout(() => {
            if (loading === 0) {
                document.getElementById('axios-loading-backdrop').style.display = 'none';
            }
        }, 500);
        return Promise.reject(error);
    },
);
export const catchAxiosError =
    (message: string | undefined, showSnackSev: (message?: string, sev?: AlertColor) => void) => (err: any) => {
        if (!err.response) {
            showSnackSev('Server did not respond, please open an issue on our Github', 'error');
            console.error(err);
        }
        else if (err.response?.status >= 500) {
            showSnackSev('Something went wrong, please try again later', 'error');
            console.error(err);
        }
       else if (message) {
            if (err.response?.data?.message) {
                showSnackSev(`${message}: ${err.response.data.message}`, 'error');
            }
            showSnackSev(message, 'error');
        }
        else if (err.response?.data?.message) {
            showSnackSev(`Something went wrong: ${err.response.data.message}`, 'error');
        }
        else {
            showSnackSev('Something went wrong', 'error');
        }
    };

export default instance;
