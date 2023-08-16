import { ErrorPage } from '../../layouts/ErrorPage';
import { useEffect } from 'react';

export const Logout = () => {
    useEffect(() => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    });
    return <ErrorPage name="Page not found" message={<>Redirecting...</>} />;
};
